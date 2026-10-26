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
