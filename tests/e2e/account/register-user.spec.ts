import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { HOME } from '../../../constants/home.constants';
import { REGISTER_USER } from '../../../constants/register-user.constants';
import { HomePage } from '../../../pages/home.page';
import { LoginPage } from '../../../pages/login.page';
import { RegisterUserPage } from '../../../pages/register-user.page';
import registrationUser from '../../../test-data/users.json';

test('Test Case 1: Register User', async ({ page }) => {
  const homePage = new HomePage(page);
  const registerUserPage = new RegisterUserPage(page);
  const email = `${registrationUser.emailPrefix}${randomUUID()}${registrationUser.emailDomain}`;

  await test.step('Open the home page and navigate to signup', async () => {
    await homePage.gotoHome();
    await homePage.dismissConsentIfVisible();
    await expect(page).toHaveTitle(HOME.titlePattern);
    await homePage.openLogin();
  });

  await test.step('Submit signup details and verify the account form', async () => {
    await expect(registerUserPage.signupHeading).toBeVisible();
    await registerUserPage.startRegistration(registrationUser.name, email);
    await expect(registerUserPage.accountHeading).toBeVisible();
  });

  await test.step('Complete account details and verify account creation', async () => {
    await registerUserPage.completeRegistration(registrationUser);
    await expect(registerUserPage.accountCreatedHeading).toBeVisible();
  });

  await test.step('Delete the created test account', async () => {
    await registerUserPage.continueAfterAccountCreation();
    await expect(
      page.getByText(
        `${REGISTER_USER.confirmation.loggedInAsPrefix}${registrationUser.name}`,
      ),
    ).toBeVisible();
    await homePage.deleteAccount();
    await expect(homePage.deletedHeading).toBeVisible();
    await registerUserPage.continueAfterAccountCreation();
  });
});

test.describe('Test Case 5: Register User with existing email', () => {
  let accountEmail: string;
  let accountCreated = false;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    const registerUserPage = new RegisterUserPage(page);
    accountEmail = `${registrationUser.emailPrefix}${randomUUID()}${registrationUser.emailDomain}`;
    accountCreated = false;

    await test.step('Create an account to reserve the email address', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
      await homePage.openLogin();
      await expect(registerUserPage.signupHeading).toBeVisible();
      await registerUserPage.startRegistration(registrationUser.name, accountEmail);
      await expect(registerUserPage.accountHeading).toBeVisible();
      await registerUserPage.completeRegistration(registrationUser);
      await expect(registerUserPage.accountCreatedHeading).toBeVisible();
      accountCreated = true;
      await registerUserPage.continueAfterAccountCreation();
      await expect(homePage.loggedInAs).toBeVisible();
      await homePage.logout();
    });
  });

  test.afterEach(async ({ page }) => {
    if (!accountCreated) {
      return;
    }

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await test.step('Delete the account created for the duplicate-email test', async () => {
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

  test('rejects signup with an already registered email', async ({ page }) => {
    const homePage = new HomePage(page);
    const registerUserPage = new RegisterUserPage(page);

    await test.step('Navigate to signup and verify the signup form', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
      await homePage.openLogin();
      await expect(registerUserPage.signupHeading).toBeVisible();
    });

    await test.step('Submit a name with the already registered email', async () => {
      await registerUserPage.startRegistration(registrationUser.name, accountEmail);
    });

    await test.step('Verify the duplicate-email error is displayed', async () => {
      await expect(registerUserPage.existingEmailError).toBeVisible();
    });
  });
});
