import type { Locator, Page } from '@playwright/test';
import { PRODUCTS } from '../constants/products.constants';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get allProductsHeading(): Locator {
    return this.page.getByRole('heading', {
      name: PRODUCTS.allProductsHeading,
      exact: true,
    });
  }

  get firstViewProductLink(): Locator {
    return this.page
      .getByRole('link', {
        name: PRODUCTS.viewProductLinkName,
      })
      .first();
  }

  get firstProductHeading(): Locator {
    return this.page.getByRole('heading', {
      name: PRODUCTS.firstProduct.name,
      exact: true,
    });
  }

  get firstProductCategory(): Locator {
    return this.page
      .getByRole('paragraph')
      .filter({ hasText: PRODUCTS.firstProduct.category });
  }

  get firstProductAvailability(): Locator {
    return this.page
      .getByRole('paragraph')
      .filter({ hasText: PRODUCTS.firstProduct.availability });
  }

  get firstProductCondition(): Locator {
    return this.page
      .getByRole('paragraph')
      .filter({ hasText: PRODUCTS.firstProduct.condition });
  }

  get firstProductBrand(): Locator {
    return this.page
      .getByRole('paragraph')
      .filter({ hasText: PRODUCTS.firstProduct.brand });
  }

  async gotoProducts(): Promise<void> {
    await this.goto(PRODUCTS.route);
    await this.dismissConsentIfVisible();
  }

  async openFirstProduct(): Promise<void> {
    await this.firstViewProductLink.click();
  }
}
