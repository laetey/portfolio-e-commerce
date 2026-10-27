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

  get brandsHeading(): Locator {
    return this.page.getByRole('heading', {
      name: PRODUCTS.brandsHeading,
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

  get searchInput(): Locator {
    return this.page.getByRole('textbox', {
      name: PRODUCTS.search.inputLabel,
      exact: true,
    });
  }

  get searchButton(): Locator {
    return this.page.getByRole('button', {
      name: PRODUCTS.search.buttonAccessibleName,
      exact: true,
    });
  }

  get searchedProductsHeading(): Locator {
    return this.page.getByRole('heading', {
      name: PRODUCTS.search.heading,
      exact: true,
    });
  }

  get searchedProductName(): Locator {
    return this.page
      .getByRole('paragraph')
      .filter({ hasText: PRODUCTS.search.productName })
      .first();
  }

  get searchedProductCards(): Locator {
    return this.page.locator('.features_items .product-image-wrapper');
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

  brandLink(brandName: string): Locator {
    return this.page.getByRole('link', {
      name: new RegExp(`^\\(\\d+\\)\\s*${brandName}$`, 'i'),
    });
  }

  brandProductsHeading(brandName: string): Locator {
    return this.page.getByRole('heading', {
      name: new RegExp(
        `${PRODUCTS.brandProducts.headingPrefix}${brandName}${PRODUCTS.brandProducts.headingSuffix}`,
        'i',
      ),
    });
  }

  async gotoProducts(): Promise<void> {
    await this.goto(PRODUCTS.route);
    await this.dismissConsentIfVisible();
  }

  async openFirstProduct(): Promise<void> {
    await this.firstViewProductLink.click();
  }

  async searchForProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async openBrand(brandName: string): Promise<void> {
    await this.brandLink(brandName).click();
  }
}
