@no_mobile
Feature: Using the Script Edit Page

Scenario: View the script edit page
  Given I create a levelbuilder named "Levi"
  And I create a temp script
  And I view the temp script overview page
  And I view the temp script legacy edit page
  And I delete the temp script

Scenario: View the script edit page in locale besides en-US
  Given I am on "http://studio.code.org/home/lang/es"
  And I create a levelbuilder named "Levi"
  And I create a temp script
  And I view the temp script overview page
  And I try to view the temp script legacy edit page
  And I get redirected to "/" via "dashboard"
  And I wait until element "#homepage-container" is visible
  And I wait until element "#homepage-container" contains text "Editing on levelbuilder is only supported in English (en-US locale)."
  And I delete the temp script

Scenario: Save changes to a script
  Given I create a levelbuilder named "Levi"
  And I create a temp script
  And I view the temp script overview page
  And element ".uitest-bubble" contains text "1"
  And element ".uitest-bubble" does not contain text "2"

  When I view the temp script legacy edit page
  And element "#script_text" contains text "lesson 'temp-lesson', display_name: 'Temp Lesson'"
  And element "#script_text" contains text "level 'Applab test'"
  And I type "lesson 'temp-lesson', display_name: 'Temp Lesson'\nlevel 'Standalone_Artist_1'\nlevel 'Standalone_Artist_2'\n" into "#script_text"
  And I click selector ".btn-primary" to load a new page
  And I wait until element "#script-title" is visible

  Then element ".uitest-bubble" contains text "1"
  And element ".uitest-bubble" contains text "2"

  And I delete the temp script
