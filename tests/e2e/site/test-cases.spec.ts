import { expect, test } from '@playwright/test';
import { HOME } from '../../../constants/home.constants';
import { TEST_CASES_PAGE } from '../../../constants/test-cases.constants';
import { HomePage } from '../../../pages/home.page';
import { TestCasesPage } from '../../../pages/test-cases.page';

test.describe('Page Test Cases', () => {
  test.beforeEach(async ({ page }) => {
    await new TestCasesPage(page).gotoTestCases();
  });

  test('affiche la page des scénarios de test', async ({ page }) => {
    const testCasesPage = new TestCasesPage(page);
    await expect(page).toHaveTitle(TEST_CASES_PAGE.title);
    await expect(testCasesPage.heading).toBeVisible();
  });

  test('présente les 26 scénarios disponibles', async ({ page }) => {
    const testCasesPage = new TestCasesPage(page);

    await expect(testCasesPage.scenarioLinks).toHaveCount(
      TEST_CASES_PAGE.scenarioCount,
    );
    await expect(testCasesPage.firstScenarioLink).toBeVisible();
    await expect(testCasesPage.lastScenarioLink).toBeVisible();
  });

  test('affiche les étapes quand un scénario est ouvert', async ({ page }) => {
    const testCasesPage = new TestCasesPage(page);
    await testCasesPage.openScenario7();

    for (const stepText of TEST_CASES_PAGE.scenario7StepTexts) {
      await expect(testCasesPage.scenario7Step(stepText)).toBeVisible();
    }
  });

  test('affiche la consigne et la section de retour utilisateur', async ({
    page,
  }) => {
    const testCasesPage = new TestCasesPage(page);
    await expect(testCasesPage.instructionsHeading).toBeVisible();
    await expect(testCasesPage.feedbackHeading).toBeVisible();
  });
});

test.describe('Test Case 7: Verify Test Cases Page', () => {
  test('opens the Test Cases page from the home page', async ({ page }) => {
    const homePage = new HomePage(page);
    const testCasesPage = new TestCasesPage(page);

    await test.step('Navigate to the home page and verify it is visible', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });

    await test.step('Open Test Cases and verify the destination page', async () => {
      await homePage.openTestCases();
      await expect(page).toHaveTitle(TEST_CASES_PAGE.title);
      await expect(testCasesPage.heading).toBeVisible();
    });
  });
});
