import type { Locator, Page } from '@playwright/test';
import { DELETE_ACCOUNT } from '../constants/delete-account.constants';
import { HOME } from '../constants/home.constants';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoHome(): Promise<void> {
    await this.goto(HOME.route);
  }

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

  async logout(): Promise<void> {
    await this.page
      .getByRole('link', { name: HOME.nav.logoutLink })
      .click();
  }

  get loggedInAs(): Locator {
    return this.page.getByText(DELETE_ACCOUNT.loggedInAsPattern);
  }

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
