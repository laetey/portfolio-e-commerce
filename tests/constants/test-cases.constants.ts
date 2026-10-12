export const TEST_CASES_PAGE = {
  route: '/test_cases',
  title: 'Automation Practice Website for UI Testing - Test Cases',
  heading: 'Test Cases',
  consentButtonName: 'Consent',
  scenarioLinkSelector: 'a[href^="#collapse"]',
  scenarioCount: 26,
  firstScenarioLinkName: 'Test Case 1: Register User',
  lastScenarioLinkPattern: /Test Case 26: Verify Scroll Up without/,
  scenario7LinkName: 'Test Case 7: Verify Test Cases Page',
  scenario7PanelSelector: '#collapse7',
  scenario7StepTexts: [
    'Launch browser',
    'Verify user is navigated to test cases page successfully',
  ],
  instructionsHeadingPattern:
    /Below is the list of test Cases for you to practice the Automation/,
  feedbackHeading: 'Feedback for Us',
} as const;
