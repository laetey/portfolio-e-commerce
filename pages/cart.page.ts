import type { Locator, Page } from '@playwright/test';
import { CART } from '../constants/cart.constants';
import { HOME } from '../constants/home.constants';
import { PRODUCTS } from '../constants/products.constants';
import { HomePage } from './home.page';

export class CartPage extends HomePage {
  constructor(page: Page) {
    super(page);
  }

  get allProductsHeading(): Locator {
    return this.page.getByRole('heading', {
      name: PRODUCTS.allProductsHeading,
      exact: true,
    });
  }

  get addedHeading(): Locator {
    return this.page.getByRole('heading', {
      name: CART.addedHeading,
      exact: true,
    });
  }

  get continueShoppingButton(): Locator {
    return this.page.getByRole('button', {
      name: CART.continueShoppingButton,
      exact: true,
    });
  }

  get viewCartLink(): Locator {
    return this.page.getByRole('link', {
      name: CART.viewCartLink,
      exact: true,
    });
  }

  async openCart(): Promise<void> {
    await this.page
      .getByRole('link', { name: HOME.nav.cartLink })
      .click();
  }

  async openProducts(): Promise<void> {
    await this.goto(PRODUCTS.route);
    await this.dismissConsentIfVisible();
  }

  async addProductToCart(productIndex: number): Promise<void> {
    await this.page
      .getByRole('link', { name: PRODUCTS.viewProductLinkName })
      .nth(productIndex)
      .hover();
    await this.page
      .getByText(CART.addToCartText, { exact: true })
      .nth(productIndex * 2)
      .click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async viewCartFromDialog(): Promise<void> {
    await this.viewCartLink.click();
  }

  productRow(productName: string): Locator {
    return this.page
      .getByRole('row')
      .filter({
        has: this.page.getByRole('heading', {
          name: productName,
          exact: true,
        }),
      });
  }

  productPriceCell(productName: string): Locator {
    return this.productRow(productName).getByRole('cell').nth(2);
  }

  productQuantityCell(productName: string): Locator {
    return this.productRow(productName).getByRole('cell').nth(3);
  }

  productTotalCell(productName: string): Locator {
    return this.productRow(productName).getByRole('cell').nth(4);
  }
}
