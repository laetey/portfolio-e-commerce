import path from 'node:path';
import { expect, test } from '@playwright/test';
import { CONTACT_US } from '../../../constants/contact-us.constants';
import { HOME } from '../../../constants/home.constants';
import { ContactUsPage } from '../../../pages/contact-us.page';
import { HomePage } from '../../../pages/home.page';

test.describe('Test Case 6: Contact Us Form', () => {
  test('submits the contact form and returns to the home page', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const contactUsPage = new ContactUsPage(page);
    const attachmentPath = path.resolve(
      __dirname,
      '../../../test-data/contact-attachment.txt',
    );

    await test.step('Navigate to the home page and verify it is visible', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });

    await test.step('Open Contact Us and verify the form is displayed', async () => {
      await homePage.openContactUs();
      await contactUsPage.dismissConsentIfVisible();
      await contactUsPage.waitForSubmissionHandler();
      await expect(contactUsPage.heading).toBeVisible();
    });

    await test.step('Fill the form and attach a test file', async () => {
      await contactUsPage.fillContactForm(CONTACT_US.data);
      await contactUsPage.uploadFile(attachmentPath);
    });

    await test.step('Submit the form and accept the confirmation dialog', async () => {
      let dialogType: string | undefined;
      page.once('dialog', async (dialog) => {
        dialogType = dialog.type();
        await dialog.accept();
      });
      await contactUsPage.submit();
      expect(dialogType).toBe('confirm');
    });

    await test.step('Verify successful submission and return to home', async () => {
      await expect(contactUsPage.successMessage).toHaveText(
        CONTACT_US.successMessage,
      );
      await contactUsPage.returnHome();
      await expect(page).toHaveTitle(HOME.titlePattern);
      await expect(
        page.getByRole('link', { name: HOME.nav.loginLink }),
      ).toBeVisible();
    });
  });
});
