import type { Page } from '@playwright/test';
import { HOME } from '../constants/home.constants';

export class BasePage {
  constructor(protected readonly page: Page) {}

  // ===================== NAVIGATION =============================
  async goto(route: string): Promise<void> {
    await this.page.goto(route);
  }

  // ==================== ACCEPT COOKIES ==========================
  async dismissConsentIfVisible(): Promise<void> {
    const consentButton = this.page.getByRole('button', {
      name: HOME.consentButtonName,
      exact: true,
    });

    if (await consentButton.isVisible()) {
      await consentButton.click();
    }
  }
}
