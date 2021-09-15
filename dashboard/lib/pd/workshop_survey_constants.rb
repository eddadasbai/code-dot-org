module Pd
  module WorkshopSurveyConstants
    include SharedWorkshopConstants

    POST_WORKSHOP_FORM_KEY = 'post_workshop'
    FACILITATOR_FORM_KEY = 'facilitator'

    FORM_CATEGORIES = [
      LOCAL_CATEGORY = 'local_summer',
      ACADEMIC_YEAR_1_CATEGORY = 'academic_year_1',
      ACADEMIC_YEAR_2_CATEGORY = 'academic_year_2',
      ACADEMIC_YEAR_3_CATEGORY = 'academic_year_3',
      ACADEMIC_YEAR_4_CATEGORY = 'academic_year_4',
      ACADEMIC_YEAR_1_2_CATEGORY = 'academic_year_1_2',
      ACADEMIC_YEAR_3_4_CATEGORY = 'academic_year_3_4',
      VIRTUAL_1_CATEGORY = 'virtual_1',
      VIRTUAL_2_CATEGORY = 'virtual_2',
      VIRTUAL_3_CATEGORY = 'virtual_3',
      VIRTUAL_4_CATEGORY = 'virtual_4',
      VIRTUAL_5_CATEGORY = 'virtual_5',
      VIRTUAL_6_CATEGORY = 'virtual_6',
      VIRTUAL_7_CATEGORY = 'virtual_7',
      VIRTUAL_8_CATEGORY = 'virtual_8',
      CSF_CATEGORY = 'csf',
    ]

    CATEGORY_MAP = {
      SUBJECT_CSP_SUMMER_WORKSHOP => LOCAL_CATEGORY,
      SUBJECT_CSP_WORKSHOP_1 => ACADEMIC_YEAR_1_CATEGORY,
      SUBJECT_CSP_WORKSHOP_2 => ACADEMIC_YEAR_2_CATEGORY,
      SUBJECT_CSP_WORKSHOP_3 => ACADEMIC_YEAR_3_CATEGORY,
      SUBJECT_CSP_WORKSHOP_4 => ACADEMIC_YEAR_4_CATEGORY,
      SUBJECT_CSP_WORKSHOP_1_2 => ACADEMIC_YEAR_1_2_CATEGORY,
      SUBJECT_CSP_WORKSHOP_3_4 => ACADEMIC_YEAR_3_4_CATEGORY,
      SUBJECT_CSP_TEACHER_CON => LOCAL_CATEGORY,

      SUBJECT_CSD_SUMMER_WORKSHOP => LOCAL_CATEGORY,
      SUBJECT_CSD_WORKSHOP_1 => ACADEMIC_YEAR_1_CATEGORY,
      SUBJECT_CSD_WORKSHOP_2 => ACADEMIC_YEAR_2_CATEGORY,
      SUBJECT_CSD_WORKSHOP_3 => ACADEMIC_YEAR_3_CATEGORY,
      SUBJECT_CSD_WORKSHOP_4 => ACADEMIC_YEAR_4_CATEGORY,
      SUBJECT_CSD_WORKSHOP_1_2 => ACADEMIC_YEAR_1_2_CATEGORY,
      SUBJECT_CSD_WORKSHOP_3_4 => ACADEMIC_YEAR_3_4_CATEGORY,
      SUBJECT_CSD_TEACHER_CON => LOCAL_CATEGORY,

      SUBJECT_CSA_SUMMER_WORKSHOP => LOCAL_CATEGORY,
      SUBJECT_CSA_WORKSHOP_1 => ACADEMIC_YEAR_1_CATEGORY,
      SUBJECT_CSA_WORKSHOP_2 => ACADEMIC_YEAR_2_CATEGORY,
      SUBJECT_CSA_WORKSHOP_3 => ACADEMIC_YEAR_3_CATEGORY,
      SUBJECT_CSA_WORKSHOP_4 => ACADEMIC_YEAR_4_CATEGORY,
      SUBJECT_CSA_WORKSHOP_1_2 => ACADEMIC_YEAR_1_2_CATEGORY,
      SUBJECT_CSA_WORKSHOP_3_4 => ACADEMIC_YEAR_3_4_CATEGORY,
      SUBJECT_CSA_TEACHER_CON => LOCAL_CATEGORY,

      SUBJECT_CSF_201 => CSF_CATEGORY,

      LEGACY_SUBJECT_CSP_WORKSHOP_1 => ACADEMIC_YEAR_1_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_2 => ACADEMIC_YEAR_2_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_3 => ACADEMIC_YEAR_3_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_4 => ACADEMIC_YEAR_4_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_5 => ACADEMIC_YEAR_1_2_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_6 => ACADEMIC_YEAR_3_4_CATEGORY,

      LEGACY_SUBJECT_CSP_WORKSHOP_1_1920 => ACADEMIC_YEAR_1_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_2_1920 => ACADEMIC_YEAR_2_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_3_1920 => ACADEMIC_YEAR_3_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_4_1920 => ACADEMIC_YEAR_4_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_5_1920 => ACADEMIC_YEAR_1_2_CATEGORY,
      LEGACY_SUBJECT_CSP_WORKSHOP_6_1920 => ACADEMIC_YEAR_3_4_CATEGORY,

      LEGACY_SUBJECT_CSP_VIRTUAL_1 => VIRTUAL_1_CATEGORY,
      LEGACY_SUBJECT_CSP_VIRTUAL_2 => VIRTUAL_2_CATEGORY,
      LEGACY_SUBJECT_CSP_VIRTUAL_3 => VIRTUAL_3_CATEGORY,
      LEGACY_SUBJECT_CSP_VIRTUAL_4 => VIRTUAL_4_CATEGORY,
      LEGACY_SUBJECT_CSP_VIRTUAL_5 => VIRTUAL_5_CATEGORY,
      LEGACY_SUBJECT_CSP_VIRTUAL_6 => VIRTUAL_6_CATEGORY,
      LEGACY_SUBJECT_CSP_VIRTUAL_7 => VIRTUAL_7_CATEGORY,
      LEGACY_SUBJECT_CSP_VIRTUAL_8 => VIRTUAL_8_CATEGORY,

      LEGACY_SUBJECT_CSD_UNITS_2_3 => ACADEMIC_YEAR_1_CATEGORY,
      LEGACY_SUBJECT_CSD_UNIT_3_4 => ACADEMIC_YEAR_2_CATEGORY,
      LEGACY_SUBJECT_CSD_UNITS_4_5 => ACADEMIC_YEAR_3_CATEGORY,
      LEGACY_SUBJECT_CSD_UNIT_6 => ACADEMIC_YEAR_4_CATEGORY,
      LEGACY_SUBJECT_CSD_UNITS_1_3 => ACADEMIC_YEAR_1_2_CATEGORY,
      LEGACY_SUBJECT_CSD_UNITS_4_6 => ACADEMIC_YEAR_3_4_CATEGORY,

      LEGACY_SUBJECT_CSD_WORKSHOP_1_1920 => ACADEMIC_YEAR_1_CATEGORY,
      LEGACY_SUBJECT_CSD_WORKSHOP_2_1920 => ACADEMIC_YEAR_2_CATEGORY,
      LEGACY_SUBJECT_CSD_WORKSHOP_3_1920 => ACADEMIC_YEAR_3_CATEGORY,
      LEGACY_SUBJECT_CSD_WORKSHOP_4_1920 => ACADEMIC_YEAR_4_CATEGORY,
      LEGACY_SUBJECT_CSD_WORKSHOP_5_1920 => ACADEMIC_YEAR_1_2_CATEGORY,
      LEGACY_SUBJECT_CSD_WORKSHOP_6_1920 => ACADEMIC_YEAR_3_4_CATEGORY,

      LEGACY_SUBJECT_CSD_VIRTUAL_1 => VIRTUAL_1_CATEGORY,
      LEGACY_SUBJECT_CSD_VIRTUAL_2 => VIRTUAL_2_CATEGORY,
      LEGACY_SUBJECT_CSD_VIRTUAL_3 => VIRTUAL_3_CATEGORY,
      LEGACY_SUBJECT_CSD_VIRTUAL_4 => VIRTUAL_4_CATEGORY,
      LEGACY_SUBJECT_CSD_VIRTUAL_5 => VIRTUAL_5_CATEGORY,
      LEGACY_SUBJECT_CSD_VIRTUAL_6 => VIRTUAL_6_CATEGORY,
      LEGACY_SUBJECT_CSD_VIRTUAL_7 => VIRTUAL_7_CATEGORY,
      LEGACY_SUBJECT_CSD_VIRTUAL_8 => VIRTUAL_8_CATEGORY,
    }

    CSF_SURVEY_NAMES = [
      PRE_DEEPDIVE_SURVEY = 'pre201',
      POST_DEEPDIVE_SURVEY = 'post201',
    ]

    # Explicitly map survey names to indexes.
    # Index valule is then saved to 'day' column in WorkshopDailySurvey table.
    CSF_SURVEY_INDEXES = {
      PRE_DEEPDIVE_SURVEY => 0,
      POST_DEEPDIVE_SURVEY => 1
    }

    # valid day numbers for different workshop categories
    VALID_DAYS = {
      LOCAL_CATEGORY => (0..5).to_a.freeze,
      ACADEMIC_YEAR_1_CATEGORY => [1].freeze,
      ACADEMIC_YEAR_2_CATEGORY => [1].freeze,
      ACADEMIC_YEAR_3_CATEGORY => [1].freeze,
      ACADEMIC_YEAR_4_CATEGORY => [1].freeze,
      ACADEMIC_YEAR_1_2_CATEGORY => [1, 2].freeze,
      ACADEMIC_YEAR_3_4_CATEGORY => [1, 2].freeze,
      VIRTUAL_1_CATEGORY => [1].freeze,
      VIRTUAL_2_CATEGORY => [1].freeze,
      VIRTUAL_3_CATEGORY => [1].freeze,
      VIRTUAL_4_CATEGORY => [1].freeze,
      VIRTUAL_5_CATEGORY => [1].freeze,
      VIRTUAL_6_CATEGORY => [1].freeze,
      VIRTUAL_7_CATEGORY => [1].freeze,
      VIRTUAL_8_CATEGORY => [1].freeze,
      CSF_CATEGORY => CSF_SURVEY_INDEXES.values.freeze
    }
  end
end
