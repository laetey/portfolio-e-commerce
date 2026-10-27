import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { HOME } from '../../../constants/home.constants';
import { LOGIN_USER } from '../../../constants/login-user.constants';
import { HomePage } from '../../../pages/home.page';
import { LoginPage } from '../../../pages/login.page';
import { RegisterUserPage } from '../../../pages/register-user.page';
import registrationUser from '../../../test-data/users.json';

test.describe('Login scenarios with a registered account', () => {
  let accountEmail: string;
  let accountCreated = false;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    const registerUserPage = new RegisterUserPage(page);
    accountEmail = `${registrationUser.emailPrefix}${randomUUID()}${registrationUser.emailDomain}`;
    accountCreated = false;

    await test.step('Register a test account before the login scenario', async () => {
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

    await test.step('Delete the registered account after the login scenario', async () => {
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

  test.describe('Test Case 2: Login User with correct email and password', () => {
    test('logs in successfully with the registered account', async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);

      await test.step('Navigate to the home page and verify it is visible', async () => {
        await homePage.gotoHome();
        await homePage.dismissConsentIfVisible();
        await expect(page).toHaveTitle(HOME.titlePattern);
      });

      await test.step('Open login and verify the login form is displayed', async () => {
        await homePage.openLogin();
        await expect(loginPage.heading).toBeVisible();
      });

      await test.step('Log in with the correct email and password', async () => {
        await loginPage.login(accountEmail, registrationUser.password);
        await expect(homePage.loggedInAs).toBeVisible();
      });
    });
  });

  test.describe('Test Case 4: Logout User', () => {
    test('logs out and returns to the login page', async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);

      await test.step('Navigate to the home page and verify it is visible', async () => {
        await homePage.gotoHome();
        await homePage.dismissConsentIfVisible();
        await expect(page).toHaveTitle(HOME.titlePattern);
      });

      await test.step('Open login and verify the login form is displayed', async () => {
        await homePage.openLogin();
        await expect(loginPage.heading).toBeVisible();
      });

      await test.step('Log in with the registered email and password', async () => {
        await loginPage.login(accountEmail, registrationUser.password);
        await expect(homePage.loggedInAs).toBeVisible();
      });

      await test.step('Log out and verify navigation to the login page', async () => {
        await homePage.logout();
        await expect(loginPage.heading).toBeVisible();
      });
    });
  });
});

test.describe('Test Case 3: Login User with incorrect email and password', () => {
  test('rejects invalid credentials with an error message', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const invalidEmail = `${LOGIN_USER.invalidCredentials.emailPrefix}${randomUUID()}${LOGIN_USER.invalidCredentials.emailDomain}`;

    await test.step('Navigate to the home page and verify it is visible', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });

    await test.step('Open login and verify the login form is displayed', async () => {
      await homePage.openLogin();
      await expect(loginPage.heading).toBeVisible();
    });

    await test.step('Submit incorrect email and password', async () => {
      await loginPage.login(
        invalidEmail,
        LOGIN_USER.invalidCredentials.password,
      );
    });

    await test.step('Verify the invalid credentials error is displayed', async () => {
      await expect(loginPage.invalidCredentialsError).toBeVisible();
    });
  });
});
