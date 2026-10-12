import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { REGISTER_USER } from './constants/register-user.constants';

test('Test Case 1: Register User', async ({ page }) => {
  const { data, signup, account, confirmation } = REGISTER_USER;
  const email = `${data.emailPrefix}${randomUUID()}${data.emailDomain}`;

  await page.goto(REGISTER_USER.route);

  const consentButton = page.getByRole('button', {
    name: REGISTER_USER.consent.buttonName,
    exact: true,
  });
  if (await consentButton.isVisible()) {
    await consentButton.click();
  }

  await expect(
    page.getByRole('heading', { name: signup.heading }),
  ).toBeVisible();

  const signupForm = page.locator(REGISTER_USER.signupForm);
  await signupForm.locator(signup.nameField).fill(data.name);
  await signupForm.locator(signup.emailField).fill(email);
  await signupForm.getByRole('button', { name: signup.buttonName }).click();

  await expect(
    page.getByRole('heading', { name: account.heading }),
  ).toBeVisible();

  const accountForm = page.locator(REGISTER_USER.signupForm);
  await accountForm.locator(account.genderRadio).check();
  await accountForm.locator(account.passwordField).fill(data.password);
  await accountForm.locator(account.daySelect).selectOption(data.day);
  await accountForm.locator(account.monthSelect).selectOption(data.month);
  await accountForm.locator(account.yearSelect).selectOption(data.year);
  await accountForm.locator(account.newsletterCheckbox).check();
  await accountForm.locator(account.optInCheckbox).check();

  await accountForm.locator(account.firstNameField).fill(data.firstName);
  await accountForm.locator(account.lastNameField).fill(data.lastName);
  await accountForm.locator(account.companyField).fill(data.company);
  await accountForm.locator(account.addressField).fill(data.address);
  await accountForm.locator(account.address2Field).fill(data.address2);
  await accountForm.locator(account.countrySelect).selectOption({
    label: data.country,
  });
  await accountForm.locator(account.stateField).fill(data.state);
  await accountForm.locator(account.cityField).fill(data.city);
  await accountForm.locator(account.zipcodeField).fill(data.zipcode);
  await accountForm.locator(account.mobileNumberField).fill(data.mobileNumber);
  await accountForm
    .getByRole('button', { name: account.createButtonName })
    .click();

  await expect(
    page.getByRole('heading', { name: confirmation.accountCreatedHeading }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: confirmation.continueLinkName })
    .click();

  await expect(
    page.getByText(`${confirmation.loggedInAsPrefix}${data.name}`),
  ).toBeVisible();
  await page
    .getByRole('link', { name: confirmation.deleteAccountLinkName })
    .click();

  await expect(
    page.getByRole('heading', { name: confirmation.accountDeletedHeading }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: confirmation.continueLinkName })
    .click();
});
