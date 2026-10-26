import type { Locator, Page } from '@playwright/test';
import { CHECKOUT } from '../constants/checkout.constants';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get deliveryAddressHeading(): Locator {
    return this.page.getByRole('heading', {
      name: CHECKOUT.deliveryAddressHeading,
      exact: true,
    });
  }

  get billingAddressHeading(): Locator {
    return this.page.getByRole('heading', {
      name: CHECKOUT.billingAddressHeading,
      exact: true,
    });
  }

  get reviewOrderHeading(): Locator {
    return this.page.getByRole('heading', {
      name: CHECKOUT.reviewOrderHeading,
      exact: true,
    });
  }

  get placeOrderLink(): Locator {
    return this.page.getByRole('link', {
      name: CHECKOUT.placeOrderLink,
      exact: true,
    });
  }

  get paymentHeading(): Locator {
    return this.page.getByRole('heading', {
      name: CHECKOUT.paymentHeading,
      exact: true,
    });
  }

  get paymentNameInput(): Locator {
    return this.page.getByTestId(CHECKOUT.payment.nameOnCardTestId);
  }

  get paymentCardNumberInput(): Locator {
    return this.page.getByTestId(CHECKOUT.payment.cardNumberTestId);
  }

  get paymentCvcInput(): Locator {
    return this.page.getByTestId(CHECKOUT.payment.cvcTestId);
  }

  get paymentExpiryMonthInput(): Locator {
    return this.page.getByTestId(CHECKOUT.payment.expiryMonthTestId);
  }

  get paymentExpiryYearInput(): Locator {
    return this.page.getByTestId(CHECKOUT.payment.expiryYearTestId);
  }

  get payAndConfirmButton(): Locator {
    return this.page.getByRole('button', {
      name: CHECKOUT.paymentButton,
      exact: true,
    });
  }

  get orderSuccessMessage(): Locator {
    return this.page.getByText(CHECKOUT.orderSuccessMessage, { exact: true });
  }

  addressDetail(value: string): Locator {
    return this.page.getByText(value, { exact: true });
  }

  async enterOrderComment(comment: string): Promise<void> {
    await this.page.getByRole('textbox').first().fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderLink.click();
  }

  async enterPaymentDetails(): Promise<void> {
    await this.paymentNameInput.fill(CHECKOUT.payment.nameOnCard);
    await this.paymentCardNumberInput.fill(CHECKOUT.payment.cardNumber);
    await this.paymentCvcInput.fill(CHECKOUT.payment.cvc);
    await this.paymentExpiryMonthInput.fill(CHECKOUT.payment.expiryMonth);
    await this.paymentExpiryYearInput.fill(CHECKOUT.payment.expiryYear);
  }

  async payAndConfirmOrder(): Promise<void> {
    await this.payAndConfirmButton.click();
  }
}
