@no_mobile
@as_young_student

Feature: Project Sharing - Young Students

Scenario: Young Students Can Always Share Play Lab Projects
  Then I make a playlab project named "Playlab Project!"
  And I open the project share dialog
  Then the project can be published
  Then I publish the project from the share dialog
  Given I open the project share dialog
  And the project is published

Scenario: Young Students Can Not By Default Make App Lab Projects
  Then I am on "http://studio.code.org/projects/applab/new"
  And I get redirected to "/home" via "dashboard"
  And element ".alert" is visible
