require 'cdo/chat_client'
require 'dynamic_config/dcdo'

# This module is the entry point for all "Curriculum PDFs", referring to the
# PDFs that we automatically generate from our teacher-facing Lesson Plans and
# related content.
#
# Note that, following Rails convention, this file defines the basic structure
# of the module but most of the logic lives in the submodules, as defined in
# the various other files in the `curriculum_pdfs/` directory.
#
# Currently (as of September 2021), we generate the following kind of PDFs:
#
# - Teacher-facing Lesson Plans (for example, https://lesson-plans.code.org/csp1-2021/20210826162223/teacher-lesson-plans/Welcome+to+CSP.pdf)
# - Student-facing Lesson Plans (for example, https://lesson-plans.code.org/csp1-2021/20210826162223/student-lesson-plans/Welcome+to+CSP.pdf)
# - Unit Overviews (for example, https://lesson-plans.code.org/csp1-2021/20210826162223/Digital+Information+('21-'22).pdf)
# - Unit Resource Rollups (for example, https://lesson-plans.code.org/csp1-2021/20210826162223/Digital+Information+('21-'22)+-+Resources.pdf)
#
# We may also want in the future to generate more kinds, including:
#
# - student resources, based on Resource#audience
# - unit calendar
# - four rollup pages for unit, unit group, one for each of:
#   - vocab
#   - resources
#   - standards
#   - programming expressions
#
# Our overall approach for PDF generation is as follows:
#
# When lesson plan is updated on levelbuilder, we serialize it into a
# `.script_json` file. As part of that serialization we record a timestamp of
# the update, then when that file is then seeded on the staging machine, we
# compare the timestamp to the last known value; if we detect that any content
# in the entire `.script_json` file has been updated, we regenerate all PDFs
# for the associated script.
#
# See:
# - https://github.com/code-dot-org/code-dot-org/blob/ca373aa74d240412be4b3c8622cd3db9a711f367/dashboard/lib/services/script_seed.rb#L690-L699
# - https://github.com/code-dot-org/code-dot-org/blob/ca373aa74d240412be4b3c8622cd3db9a711f367/dashboard/lib/services/script_seed.rb#L244-L245
# - https://github.com/code-dot-org/code-dot-org/blob/ca373aa74d240412be4b3c8622cd3db9a711f367/dashboard/lib/services/curriculum_pdfs.rb#L60-L62
#
# PDFs are generated by puppeteer. Specifically, all content that is going to
# be converted into a PDF is built with CSS print styles as well as web-view
# styling, and we simply print the page to PDF with headless Chrome.
#
# This has two notable implications:
#
# First, it means that anyone (including teachers) can generate their own PDFs
# by simply printing the page from their own browser. This is intentional; by
# relying exclusively on standard browser implementations for page rendering
# and printing, we can be confident this functionality will work in a variety
# of situations.
#
# Second, it means that we can only render PDFs of pages that are visible to
# signed-out users, as they appear to signed-out users. This is NOT
# intentional, but is a product of the fact that the headless Chrome session we
# use to render the pages does not have user authentication information
# associated with it.
#
# After generating all PDFs on the staging machine during the staging build,
# PDFs are uploaded to S3. They're labeled with the relevant timestamp and
# served directly from S3, which allows us to generate the files once as part
# of the build and then serve them from all of our various environments without
# worrying about version mismatch. Note that this does mean that we preserve
# all generated PDFs indefinitely, which will eventually mean we're storing a
# bunch of outdated files on S3.

module Services
  # Contains all code related to the generation, storage, and
  # retrieval of Curriculum PDFs.
  #
  # Also see curriculum_pdfs.rake for some associated logic
  module CurriculumPdfs
    include LessonPlans
    include Resources
    include ScriptOverview
    include Utils
    include Curriculum::SharedCourseConstants

    DEBUG = false
    S3_BUCKET = "cdo-lesson-plans#{'-dev' if DEBUG}".freeze

    # Do no generate the overview pdf is there are no lesson plans
    def self.should_generate_overview_pdf?(unit)
      !unit.unit_without_lesson_plans?
    end

    # Do no generate the resources pdf is there are no lesson plans since
    # resources are attached to lesson plans
    def self.should_generate_resource_pdf?(unit)
      !unit.unit_without_lesson_plans? && unit.lessons.map(&:resources).flatten.any?
    end

    # Uploads all PDFs in the given directory to S3. Will preserve existing
    # organization, including subdirectories.
    def self.upload_generated_pdfs_to_s3(directory)
      ChatClient.log "Uploading all generated PDFs to S3"
      ChatClient.log "from local temporary directory #{directory.inspect}" if DEBUG
      Dir.glob(File.join(directory, '**/*.pdf')).each do |filepath|
        # Note that this "filename" includes subdirectories; this is fine
        # only because we're uploading to S3.
        data = File.read(filepath)
        filename = filepath.delete_prefix(directory).delete_prefix('/')
        AWS::S3.upload_to_bucket(S3_BUCKET, filename, data, no_random: true)
      end
    end

    def self.get_pdf_enabled_scripts
      Unit.all.select do |script|
        next false if [PUBLISHED_STATE.pilot, PUBLISHED_STATE.in_development].include?(script.get_published_state)
        next false if script.use_legacy_lesson_plans
        script.is_migrated && script.seeded_from.present?
      end
    end

    def self.get_pdfless_lessons(script)
      script.lessons.select(&:has_lesson_plan).select do |lesson|
        !lesson_plan_pdf_exists_for?(lesson) ||
          (script.include_student_lesson_plans && !lesson_plan_pdf_exists_for?(lesson, true))
      end
    end

    def self.generate_missing_pdfs
      get_pdf_enabled_scripts.each do |script|
        Dir.mktmpdir("pdf_generation") do |dir|
          any_pdf_generated = false

          get_pdfless_lessons(script).each do |lesson|
            puts "Generating missing Lesson PDFs for #{lesson.key} (from #{script.name})"
            generate_lesson_pdf(lesson, dir)
            generate_lesson_pdf(lesson, dir, true)
            any_pdf_generated = true
          end

          if !script_overview_pdf_exists_for?(script) && should_generate_overview_pdf?(script)
            puts "Generating missing Unit Overview PDF for #{script.name}"
            generate_script_overview_pdf(script, dir)
            any_pdf_generated = true
          end

          if !script_resources_pdf_exists_for?(script) && should_generate_resource_pdf?(script)
            puts "Generating missing Unit Resources PDF for #{script.name}"
            generate_script_resources_pdf(script, dir)
            any_pdf_generated = true
          end

          if any_pdf_generated
            puts "Generated all missing PDFs for #{script.name}; uploading results to S3"
            upload_generated_pdfs_to_s3(dir)
          end
        end
      end
    end
  end
end
