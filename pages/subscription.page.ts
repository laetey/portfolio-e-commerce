import type { Locator, Page } from '@playwright/test';
import { SUBSCRIPTION } from '../constants/subscription.constants';
import { BasePage } from './base.page';

export class SubscriptionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', {
      name: SUBSCRIPTION.heading,
      exact: true,
    });
  }

  get emailInput(): Locator {
    return this.page.getByRole('textbox', {
      name: SUBSCRIPTION.emailInputLabel,
      exact: true,
    });
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', {
      name: SUBSCRIPTION.submitButtonAccessibleName,
      exact: true,
    });
  }

  get successMessage(): Locator {
    return this.page.getByText(SUBSCRIPTION.successMessage, { exact: true });
  }

  async scrollToSubscription(): Promise<void> {
    await this.heading.scrollIntoViewIfNeeded();
  }

  async subscribe(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
