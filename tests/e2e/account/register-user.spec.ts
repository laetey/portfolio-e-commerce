import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { HOME } from '../../../constants/home.constants';
import { HomePage } from '../../../pages/home.page';
import { LoginPage } from '../../../pages/login.page';
import { RegisterUserPage } from '../../../pages/register-user.page';
import registrationUser from '../../../test-data/users.json';

test.describe('Registration scenarios', () => {
  let accountEmail: string;
  let accountCreated = false;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    const registerUserPage = new RegisterUserPage(page);
    accountEmail = `${registrationUser.emailPrefix}${randomUUID()}${registrationUser.emailDomain}`;
    accountCreated = false;

    await test.step('Register a unique test account', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
      await homePage.openLogin();
      await expect(registerUserPage.signupHeading).toBeVisible();
      await registerUserPage.startRegistration(
        registrationUser.name,
        accountEmail,
      );
      await expect(registerUserPage.accountHeading).toBeVisible();
      await registerUserPage.completeRegistration(registrationUser);
      await expect(registerUserPage.accountCreatedHeading).toBeVisible();
      accountCreated = true;
      await registerUserPage.continueAfterAccountCreation();
      await expect(homePage.loggedInAs).toBeVisible();
    });
  });

  test.afterEach(async ({ page }) => {
    if (!accountCreated) {
      return;
    }

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await test.step('Delete the test account after the registration scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      if (!(await homePage.loggedInAs.isVisible())) {
        await homePage.openLogin();
        await loginPage.login(accountEmail, registrationUser.password);
        await expect(homePage.loggedInAs).toBeVisible();
      }

      await homePage.deleteAccount();
      await expect(homePage.deletedHeading).toBeVisible();
      accountCreated = false;
    });
  });

  test.describe('Test Case 1: Register User', () => {
    test('creates a new user account', async ({ page }) => {
      const homePage = new HomePage(page);

      await test.step('Verify the newly registered user is logged in', async () => {
        await expect(homePage.loggedInAs).toBeVisible();
        await expect(page).toHaveTitle(HOME.titlePattern);
      });
    });
  });

  test.describe('Test Case 5: Register User with existing email', () => {
    test('rejects signup with an already registered email', async ({ page }) => {
      const homePage = new HomePage(page);
      const registerUserPage = new RegisterUserPage(page);

      await test.step('Open signup and verify the signup form', async () => {
        await homePage.logout();
        await expect(registerUserPage.signupHeading).toBeVisible();
      });

      await test.step('Submit a name with the already registered email', async () => {
        await registerUserPage.startRegistration(
          registrationUser.name,
          accountEmail,
        );
      });

      await test.step('Verify the duplicate-email error is displayed', async () => {
        await expect(registerUserPage.existingEmailError).toBeVisible();
      });
    });
  });
});
