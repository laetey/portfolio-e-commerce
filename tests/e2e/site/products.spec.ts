import { expect, test } from '@playwright/test';
import { HOME } from '../../../constants/home.constants';
import { PRODUCTS } from '../../../constants/products.constants';
import { HomePage } from '../../../pages/home.page';
import { ProductsPage } from '../../../pages/products.page';

test.describe('Test Case 8: Verify All Products and product detail page', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Open the home page before the scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });
  });

  test.afterEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Return to the home page after the scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });
  });

  test('shows the product list and the first product details', async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);

    await test.step('Open Products and verify the product list', async () => {
      await productsPage.gotoProducts();
      await expect(page).toHaveTitle(PRODUCTS.title);
      await expect(productsPage.allProductsHeading).toBeVisible();
      await expect(productsPage.firstViewProductLink).toBeVisible();
    });

    await test.step('Open the first product details', async () => {
      await productsPage.openFirstProduct();
      await expect(page).toHaveTitle(PRODUCTS.productDetailsTitle);
      await expect(productsPage.firstProductHeading).toBeVisible();
    });

    await test.step('Verify category, price, availability, condition, and brand', async () => {
      await expect(productsPage.firstProductCategory).toBeVisible();
      await expect(
        page.getByText(PRODUCTS.firstProduct.price, { exact: true }).first(),
      ).toBeVisible();
      await expect(productsPage.firstProductAvailability).toBeVisible();
      await expect(productsPage.firstProductCondition).toBeVisible();
      await expect(productsPage.firstProductBrand).toBeVisible();
    });
  });
});

test.describe('Test Case 9: Search Product', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Open the home page before the scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });
  });

  test.afterEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Return to the home page after the scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });
  });

  test('shows products matching the search term', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await test.step('Open Products and verify the product catalog', async () => {
      await productsPage.gotoProducts();
      await expect(page).toHaveTitle(PRODUCTS.title);
      await expect(productsPage.allProductsHeading).toBeVisible();
    });

    await test.step('Search for a product by name', async () => {
      await productsPage.searchForProduct(PRODUCTS.search.productName);
      await expect(productsPage.searchedProductsHeading).toBeVisible();
    });

    await test.step('Verify the matching product is displayed', async () => {
      await expect(productsPage.searchedProductName).toBeVisible();
    });
  });
});

test.describe('Test Case 19: View & Cart Brand Products', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Open the home page before the scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });
  });

  test.afterEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Return to the home page after the scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });
  });

  test('opens two brand pages and verifies their products', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await test.step('Open Products and verify the brand list', async () => {
      await productsPage.gotoProducts();
      await expect(page).toHaveTitle(PRODUCTS.title);
      await expect(productsPage.allProductsHeading).toBeVisible();
      await expect(productsPage.brandsHeading).toBeVisible();

      for (const brandName of PRODUCTS.brandProducts.brands) {
        await expect(productsPage.brandLink(brandName)).toBeVisible();
      }
    });

    for (const brandName of PRODUCTS.brandProducts.brands) {
      await test.step(`Open ${brandName} and verify its product listing`, async () => {
        await productsPage.openBrand(brandName);
        await expect(page).toHaveURL(
          new RegExp(`/brand_products/${brandName}$`, 'i'),
        );
        await expect(productsPage.brandProductsHeading(brandName)).toBeVisible();
        await expect(productsPage.firstViewProductLink).toBeVisible();
      });
    }
  });
});
