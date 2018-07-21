require_relative '../../deployment'
require 'cdo/chat_client'
require 'cdo/rake_utils'
require 'cdo/git_utils'

namespace :build do
  desc 'Builds apps.'
  task :apps do
    Dir.chdir(apps_dir) do
      # Only rebuild if apps contents have changed since last build.
      commit_hash = apps_dir('build/commit_hash')
      if !RakeUtils.git_staged_changes?(apps_dir) &&
        File.exist?(commit_hash) &&
        File.read(commit_hash) == RakeUtils.git_folder_hash(apps_dir)

        ChatClient.log '<b>apps</b> unchanged since last build, skipping.'
        next
      end

      ChatClient.log 'Installing <b>apps</b> dependencies...'
      RakeUtils.npm_install

      # Workaround for https://github.com/karma-runner/karma-phantomjs-launcher/issues/120
      RakeUtils.npm_rebuild 'phantomjs-prebuilt'

      ChatClient.log 'Building <b>apps</b>...'
      npm_target = (rack_env?(:development) || ENV['CI']) ? 'build' : 'build:dist'
      RakeUtils.system "npm run #{npm_target}"
      File.write(commit_hash, RakeUtils.git_folder_hash(apps_dir))
    end
  end

  desc 'Builds broken link checker.'
  task :tools do
    Dir.chdir(File.join(tools_dir, "scripts", "brokenLinkChecker")) do
      ChatClient.log 'Installing <b>broken link checker</b> dependencies...'
      RakeUtils.npm_install
    end
  end

  desc 'Builds dashboard (install gems, migrate/seed db, compile assets).'
  task dashboard: :package do
    Dir.chdir(dashboard_dir) do
      # Unless on production, serve UI test directory
      unless rack_env?(:production)
        RakeUtils.ln_s('../test/ui', dashboard_dir('public', 'ui_test'))
      end

      ChatClient.log 'Installing <b>dashboard</b> bundle...'
      RakeUtils.bundle_install

      if CDO.daemon
        ChatClient.log 'Migrating <b>dashboard</b> database...'
        RakeUtils.rake 'db:setup_or_migrate'

        # Update the schema cache file, except for production which always uses the cache.
        unless rack_env?(:production)
          schema_cache_file = dashboard_dir('db/schema_cache.dump')
          RakeUtils.rake 'db:schema:cache:dump' unless ENV['CI']
          if GitUtils.file_changed_from_git?(schema_cache_file)
            # Staging is responsible for committing the authoritative schema cache dump.
            if rack_env?(:staging)
              RakeUtils.system 'git', 'add', schema_cache_file
              # This should be a no-op, but on staging we sometimes get a cache dump that changes when round-tripped through Marshal.
              2.times do
                data = File.binread(schema_cache_file)
                open(schema_cache_file, 'wb') do |f|
                  f.write(Marshal.dump(Marshal.load(data)))
                end
                checksum = `md5sum #{schema_cache_file}`.split(' ').first
                ChatClient.log "Can the schema cache #{checksum} dump be round-tripped through Marshal? #{(data == Marshal.dump(Marshal.load(data)))}"
              end
              ChatClient.log 'Committing updated schema_cache.dump file...', color: 'purple'
              RakeUtils.system 'git', 'commit', '-m', '"Update schema cache dump after schema changes."', schema_cache_file
              RakeUtils.git_push
              # The schema dump from the test database should always match that generated by staging.
            elsif rack_env?(:test) && GitUtils.current_branch == 'test'
              raise 'Unexpected database schema difference between staging and test (http://wiki.code.org/display/PROD/Unexpected+database+schema+difference+between+staging+and+test)'
            end
          end
        end

        # Allow developers to skip the time-consuming step of seeding the dashboard DB.
        # Additionally allow skipping when running in CircleCI, as it will be seeded during `rake install`
        if (rack_env?(:development) || ENV['CI']) && CDO.skip_seed_all
          ChatClient.log "Not seeding <b>dashboard</b> due to CDO.skip_seed_all...\n"\
              "Until you manually run 'rake seed:all' or disable this flag, you won't\n"\
              "see changes to: videos, concepts, levels, scripts, prize providers, \n "\
              "callouts, hints, secret words, or secret pictures."
        else
          ChatClient.log 'Seeding <b>dashboard</b>...'
          ChatClient.log 'consider setting "skip_seed_all" in locals.yml if this is taking too long' if rack_env?(:development)
          RakeUtils.rake 'seed:all', (rack_env?(:test) ? '--trace' : nil)
        end

        # Commit dsls.en.yml changes on staging
        dsls_file = dashboard_dir('config/locales/dsls.en.yml')
        if rack_env?(:staging) && GitUtils.file_changed_from_git?(dsls_file)
          RakeUtils.system 'git', 'add', dsls_file
          ChatClient.log 'Committing updated dsls.en.yml file...', color: 'purple'
          RakeUtils.system 'git', 'commit', '-m', '"Update dsls.en.yml"', dsls_file
          RakeUtils.git_push
        end
      end

      # Skip asset precompile in development where `config.assets.digest = false`.
      # Also skip on Circle CI where we will precompile assets later, right before UI tests.
      unless rack_env?(:development) || ENV['CIRCLECI']
        ChatClient.log 'Cleaning <b>dashboard</b> assets...'
        RakeUtils.rake 'assets:clean'
        ChatClient.log 'Precompiling <b>dashboard</b> assets...'
        RakeUtils.rake 'assets:precompile'
      end

      ChatClient.log 'Upgrading <b>dashboard</b>.'
      RakeUtils.upgrade_service CDO.dashboard_unicorn_name unless rack_env?(:development)

      if rack_env?(:production)
        RakeUtils.rake "honeybadger:deploy TO=#{rack_env} REVISION=`git rev-parse HEAD`"
      end
    end
  end

  desc 'Builds pegasus (install gems, migrate/seed db).'
  task :pegasus do
    Dir.chdir(pegasus_dir) do
      ChatClient.log 'Installing <b>pegasus</b> bundle...'
      RakeUtils.bundle_install
      if CDO.daemon
        ChatClient.log 'Updating <b>pegasus</b> database...'
        begin
          RakeUtils.rake 'pegasus:setup_db', (rack_env?(:test) ? '--trace' : nil)
        rescue => e
          ChatClient.log "/quote #{e.message}\n#{CDO.backtrace e}", message_format: 'text'
          raise e
        end
      end

      ChatClient.log 'Upgrading <b>pegasus</b>.'
      RakeUtils.upgrade_service CDO.pegasus_unicorn_name unless rack_env?(:development)
    end
  end

  task :restart_process_queues do
    ChatClient.log 'Restarting <b>process_queues</b>...'
    RakeUtils.restart_service 'process_queues'
  end

  tasks = []
  tasks << :apps if CDO.build_apps
  tasks << :dashboard if CDO.build_dashboard
  tasks << :pegasus if CDO.build_pegasus
  tasks << :tools if rack_env?(:staging)
  tasks << :restart_process_queues if CDO.process_queues
  task all: tasks
end

desc 'Builds everything.'
task :build do
  ChatClient.wrap('build') {Rake::Task['build:all'].invoke}
end
