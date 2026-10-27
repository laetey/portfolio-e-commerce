import { expect, test } from '@playwright/test';
import { HOME } from '../../../constants/home.constants';
import { TEST_CASES_PAGE } from '../../../constants/test-cases.constants';
import { HomePage } from '../../../pages/home.page';
import { TestCasesPage } from '../../../pages/test-cases.page';

test.describe('Test Case 7: Verify Test Cases Page', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Open the home page before the scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });
  });

  test.afterEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Return to the home page after the scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });
  });

  test('opens the Test Cases page from the home page', async ({ page }) => {
    const homePage = new HomePage(page);
    const testCasesPage = new TestCasesPage(page);

    await test.step('Open Test Cases and verify the destination page', async () => {
      await homePage.openTestCases();
      await expect(page).toHaveTitle(TEST_CASES_PAGE.title);
      await expect(testCasesPage.heading).toBeVisible();
    });
  });
});
