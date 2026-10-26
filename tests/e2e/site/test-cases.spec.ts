import { expect, test } from '@playwright/test';
import { TEST_CASES_PAGE } from '../../../constants/test-cases.constants';
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

    await expect(testCasesPage.scenario7Steps).toBeVisible();
    for (const stepText of TEST_CASES_PAGE.scenario7StepTexts) {
      await expect(testCasesPage.scenario7Steps).toContainText(stepText);
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
