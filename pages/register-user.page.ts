import type { Locator, Page } from '@playwright/test';
import { REGISTER_USER } from '../constants/register-user.constants';
import registrationUser from '../test-data/users.json';
import { BasePage } from './base.page';

export class RegisterUserPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get signupHeading(): Locator {
    return this.page.getByRole('heading', { name: REGISTER_USER.signup.heading });
  }

  get existingEmailError(): Locator {
    return this.page.getByText(REGISTER_USER.signup.existingEmailError, {
      exact: true,
    });
  }

  get accountHeading(): Locator {
    return this.page.getByRole('heading', { name: REGISTER_USER.account.heading });
  }

  get accountCreatedHeading(): Locator {
    return this.page.getByRole('heading', {
      name: REGISTER_USER.confirmation.accountCreatedHeading,
    });
  }

  async startRegistration(name: string, email: string): Promise<void> {
    const signupForm = this.page.locator(REGISTER_USER.signupForm);
    await signupForm.locator(REGISTER_USER.signup.nameField).fill(name);
    await signupForm.locator(REGISTER_USER.signup.emailField).fill(email);
    await signupForm
      .getByRole('button', { name: REGISTER_USER.signup.buttonName })
      .click();
  }

  async completeRegistration(user: typeof registrationUser): Promise<void> {
    const accountForm = this.page.locator(REGISTER_USER.signupForm);
    await accountForm.locator(REGISTER_USER.account.genderRadio).check();
    await accountForm
      .locator(REGISTER_USER.account.passwordField)
      .fill(user.password);
    await accountForm
      .locator(REGISTER_USER.account.daySelect)
      .selectOption(user.day);
    await accountForm
      .locator(REGISTER_USER.account.monthSelect)
      .selectOption(user.month);
    await accountForm
      .locator(REGISTER_USER.account.yearSelect)
      .selectOption(user.year);
    await accountForm.locator(REGISTER_USER.account.newsletterCheckbox).check();
    await accountForm.locator(REGISTER_USER.account.optInCheckbox).check();
    await accountForm
      .locator(REGISTER_USER.account.firstNameField)
      .fill(user.firstName);
    await accountForm
      .locator(REGISTER_USER.account.lastNameField)
      .fill(user.lastName);
    await accountForm
      .locator(REGISTER_USER.account.companyField)
      .fill(user.company);
    await accountForm
      .locator(REGISTER_USER.account.addressField)
      .fill(user.address);
    await accountForm
      .locator(REGISTER_USER.account.address2Field)
      .fill(user.address2);
    await accountForm.locator(REGISTER_USER.account.countrySelect).selectOption({
      label: user.country,
    });
    await accountForm
      .locator(REGISTER_USER.account.stateField)
      .fill(user.state);
    await accountForm.locator(REGISTER_USER.account.cityField).fill(user.city);
    await accountForm
      .locator(REGISTER_USER.account.zipcodeField)
      .fill(user.zipcode);
    await accountForm
      .locator(REGISTER_USER.account.mobileNumberField)
      .fill(user.mobileNumber);
    await accountForm
      .getByRole('button', { name: REGISTER_USER.account.createButtonName })
      .click();
  }

  async continueAfterAccountCreation(): Promise<void> {
    await this.page
      .getByRole('link', {
        name: REGISTER_USER.confirmation.continueLinkName,
        exact: true,
      })
      .click();
  }
}
