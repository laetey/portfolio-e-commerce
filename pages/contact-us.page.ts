import type { Locator, Page } from '@playwright/test';
import { CONTACT_US } from '../constants/contact-us.constants';
import { BasePage } from './base.page';

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
    return this.page.getByText(CONTACT_US.successMessage, { exact: true });
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
      .getByRole('link', { name: CONTACT_US.homeButtonName, exact: true })
      .click();
  }
}
