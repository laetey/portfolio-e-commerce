import type { Locator, Page } from '@playwright/test';
import { CONTACT_US } from '../constants/contact-us.constants';
import { BasePage } from './base.page';
import { HOME } from '../constants/home.constants';

export class ContactUsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', {
      name: CONTACT_US.heading,
      exact: true,
    });
  }

  get successMessage(): Locator {
    return this.page.locator(CONTACT_US.successMessageSelector);
  }

  async waitForSubmissionHandler(): Promise<void> {
    await this.page.waitForFunction((selector) => {
      const form = document.querySelector(selector);
      const jquery = Reflect.get(window, '$');
      if (!form || typeof jquery !== 'function') {
        return false;
      }

      const getData = Reflect.get(jquery, '_data');
      if (typeof getData !== 'function') {
        return false;
      }

      const events = Reflect.apply(getData, jquery, [
        form,
        'events',
      ]) as { submit?: unknown[] } | undefined;
      return Boolean(events?.submit?.length);
    }, CONTACT_US.formSelector);
  }

  async fillContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await this.page.locator(CONTACT_US.nameField).fill(data.name);
    await this.page.locator(CONTACT_US.emailField).fill(data.email);
    await this.page.locator(CONTACT_US.subjectField).fill(data.subject);
    await this.page.locator(CONTACT_US.messageField).fill(data.message);
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.page.locator(CONTACT_US.fileField).setInputFiles(filePath);
  }

  async submit(): Promise<void> {
    await this.page
      .getByRole('button', { name: CONTACT_US.submitButtonName, exact: true })
      .click();
  }

  async returnHome(): Promise<void> {
    await this.page
      .getByRole('button', { name: HOME.nav.homeLink, exact: true })
      .click();
  }
}
