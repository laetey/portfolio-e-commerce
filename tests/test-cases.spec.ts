import { expect, test } from '@playwright/test';
import { TEST_CASES_PAGE } from './constants/test-cases.constants';

test.describe('Page Test Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_CASES_PAGE.route);

    const consentButton = page.getByRole('button', {
      name: TEST_CASES_PAGE.consentButtonName,
      exact: true,
    });
    if (await consentButton.isVisible()) {
      await consentButton.click();
    }
  });

  test('affiche la page des scénarios de test', async ({ page }) => {
    await expect(page).toHaveTitle(TEST_CASES_PAGE.title);
    await expect(
      page.getByRole('heading', {
        name: TEST_CASES_PAGE.heading,
        exact: true,
      }),
    ).toBeVisible();
  });

  test('présente les 26 scénarios disponibles', async ({ page }) => {
    const scenarios = page.locator(TEST_CASES_PAGE.scenarioLinkSelector);

    await expect(scenarios).toHaveCount(TEST_CASES_PAGE.scenarioCount);
    await expect(
      page.getByRole('link', {
        name: TEST_CASES_PAGE.firstScenarioLinkName,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: TEST_CASES_PAGE.lastScenarioLinkPattern,
      }),
    ).toBeVisible();
  });

  test('affiche les étapes quand un scénario est ouvert', async ({ page }) => {
    await page
      .getByRole('link', { name: TEST_CASES_PAGE.scenario7LinkName })
      .click();

    const steps = page.locator(TEST_CASES_PAGE.scenario7PanelSelector);
    await expect(steps).toBeVisible();
    for (const stepText of TEST_CASES_PAGE.scenario7StepTexts) {
      await expect(steps).toContainText(stepText);
    }
  });

  test('affiche la consigne et la section de retour utilisateur', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', {
        name: TEST_CASES_PAGE.instructionsHeadingPattern,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: TEST_CASES_PAGE.feedbackHeading }),
    ).toBeVisible();
  });
});
