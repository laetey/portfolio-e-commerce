import type { Locator, Page } from '@playwright/test';
import { DELETE_ACCOUNT } from '../constants/delete-account.constants';
import { HOME } from '../constants/home.constants';
import { SUBSCRIPTION } from '../constants/subscription.constants';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ================================ GO TO ======================================
  async gotoHome(): Promise<void> {
    await this.goto(HOME.route);
  }

  // ================================ NAVIGATION ================================

  async openLogin(): Promise<void> {
    await this.page
      .getByRole('link', { name: HOME.nav.loginLink })
      .click();
  }

  async openContactUs(): Promise<void> {
    await this.page
      .getByRole('link', { name: HOME.nav.contactUsLink })
      .click();
  }

  async openTestCases(): Promise<void> {
    await this.page
      .getByRole('link', { name: HOME.nav.testCasesLink, exact: true })
      .click();
  }
  async openCart(): Promise<void> {
    await this.page
      .getByRole('link', { name: HOME.nav.cartLink })
      .click();
  }

  // ================================== SUBSCRIPTION ===========================
  get subscriptionHeading(): Locator {
    return this.page.getByRole('heading', {
      name: SUBSCRIPTION.heading,
      exact: true,
    });
  }

  get subscriptionEmailInput(): Locator {
    return this.page.getByRole('textbox', {
      name: SUBSCRIPTION.emailInputLabel,
      exact: true,
    });
  }

  get subscriptionSubmitButton(): Locator {
    return this.page.getByRole('button', {
      name: SUBSCRIPTION.submitButtonAccessibleName,
      exact: true,
    });
  }

  get subscriptionSuccessMessage(): Locator {
    return this.page.getByText(SUBSCRIPTION.successMessage, { exact: true });
  }

  async scrollToSubscription(): Promise<void> {
    await this.subscriptionHeading.scrollIntoViewIfNeeded();
  }

  async subscribe(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitButton.click();
  }

  // ================================= LOGOUT =================================
  async logout(): Promise<void> {
    await this.page
      .getByRole('link', { name: HOME.nav.logoutLink })
      .click();
  }

  // ================================= LOGIN ==================================
  get loggedInAs(): Locator {
    return this.page.getByText(DELETE_ACCOUNT.loggedInAsPattern);
  }

  // ================================ DELETE ACCOUNT ==========================
  get deleteAccountLink(): Locator {
    return this.page.getByRole('link', {
      name: DELETE_ACCOUNT.linkName,
    });
  }

  get deletedHeading(): Locator {
    return this.page.getByRole('heading', {
      name: DELETE_ACCOUNT.heading,
      exact: true,
    });
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }
}
