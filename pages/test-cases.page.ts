import type { Locator, Page } from '@playwright/test';
import { TEST_CASES_PAGE } from '../constants/test-cases.constants';
import { BasePage } from './base.page';

export class TestCasesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', {
      name: TEST_CASES_PAGE.heading,
      exact: true,
    });
  }

  get scenarioLinks(): Locator {
    return this.page.getByRole('link', {
      name: TEST_CASES_PAGE.scenarioLinkNamePattern,
    });
  }

  get firstScenarioLink(): Locator {
    return this.page.getByRole('link', {
      name: TEST_CASES_PAGE.firstScenarioLinkName,
    });
  }

  get lastScenarioLink(): Locator {
    return this.page.getByRole('link', {
      name: TEST_CASES_PAGE.lastScenarioLinkPattern,
    });
  }

  scenario7Step(stepText: string): Locator {
    return this.page
      .getByRole('listitem')
      .filter({ hasText: stepText });
  }

  get instructionsHeading(): Locator {
    return this.page.getByRole('heading', {
      name: TEST_CASES_PAGE.instructionsHeadingPattern,
    });
  }

  get feedbackHeading(): Locator {
    return this.page.getByRole('heading', {
      name: TEST_CASES_PAGE.feedbackHeading,
    });
  }

  async gotoTestCases(): Promise<void> {
    await this.goto(TEST_CASES_PAGE.route);
    await this.dismissConsentIfVisible();
  }

  async openScenario7(): Promise<void> {
    await this.page
      .getByRole('link', { name: TEST_CASES_PAGE.scenario7LinkName })
      .click();
  }
}
