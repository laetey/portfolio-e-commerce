import { expect, test } from '@playwright/test';
import { CART } from '../../../constants/cart.constants';
import { HOME } from '../../../constants/home.constants';
import { PRODUCTS } from '../../../constants/products.constants';
import { SUBSCRIPTION } from '../../../constants/subscription.constants';
import { CartPage } from '../../../pages/cart.page';
import { HomePage } from '../../../pages/home.page';

test.describe('Cart test cases', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Open the home page and verify it is visible', async () => {
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

  test.describe('Test Case 11: Verify Subscription in Cart page', () => {
    test('subscribes an email address from the cart page footer', async ({
      page,
    }) => {
      const cartPage = new CartPage(page);
      const email = `${SUBSCRIPTION.emailPrefix}-cart-${Date.now()}@${SUBSCRIPTION.emailDomain}`;

      await test.step('Open the Cart page', async () => {
        await cartPage.openCart();
        await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
      });

      await test.step('Scroll to the footer and verify Subscription', async () => {
        await cartPage.scrollToSubscription();
        await expect(cartPage.subscriptionHeading).toBeVisible();
      });

      await test.step('Submit an email address for the subscription', async () => {
        await cartPage.subscribe(email);
      });

      await test.step('Verify the subscription confirmation message', async () => {
        await expect(cartPage.subscriptionSuccessMessage).toHaveText(
          SUBSCRIPTION.successMessage,
        );
      });
    });
  });

  test.describe('Test Case 12: Add Products in Cart', () => {
    test('adds two products and verifies cart prices and totals', async ({
      page,
    }) => {
      const cartPage = new CartPage(page);

      await test.step('Open Products and verify the product list', async () => {
        await cartPage.openProducts();
        await expect(page).toHaveTitle(PRODUCTS.title);
        await expect(cartPage.allProductsHeading).toBeVisible();
      });

      await test.step('Add the first product and continue shopping', async () => {
        await cartPage.addProductToCart(0);
        await expect(cartPage.addedHeading).toBeVisible();
        await cartPage.continueShopping();
      });

      await test.step('Add the second product and open the cart', async () => {
        await cartPage.addProductToCart(1);
        await expect(cartPage.addedHeading).toBeVisible();
        await cartPage.viewCartFromDialog();
        await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
      });

      await test.step('Verify both products, prices, quantities, and totals', async () => {
        for (const product of CART.products) {
          await expect(cartPage.productRow(product.name)).toBeVisible();
          await expect(cartPage.productPriceCell(product.name)).toHaveText(
            product.price,
          );
          await expect(cartPage.productQuantityCell(product.name)).toHaveText(
            product.quantity,
          );
          await expect(cartPage.productTotalCell(product.name)).toHaveText(
            product.total,
          );
        }
      });
    });
  });

  test.describe('Test Case 13: Verify Product quantity in Cart', () => {
    test('adds the selected product with the requested quantity', async ({
      page,
    }) => {
      const cartPage = new CartPage(page);

      await test.step('Open the first product from the home page', async () => {
        await cartPage.openFirstProductFromHome();
        await expect(page).toHaveTitle(PRODUCTS.productDetailsTitle);
        await expect(
          page.getByRole('heading', {
            name: CART.quantityTest.productName,
            exact: true,
          }),
        ).toBeVisible();
      });

      await test.step('Set the product quantity to four', async () => {
        await cartPage.setProductQuantity(CART.quantityTest.quantity);
        await expect(cartPage.productQuantityInput).toHaveValue(
          CART.quantityTest.quantity,
        );
      });

      await test.step('Add the product to the cart and open the cart', async () => {
        await cartPage.addProductDetailsToCart();
        await expect(cartPage.addedHeading).toBeVisible();
        await cartPage.viewCartFromDialog();
        await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
      });

      await test.step('Verify the product appears with the selected quantity', async () => {
        await expect(
          cartPage.productRow(CART.quantityTest.productName),
        ).toBeVisible();
        await expect(
          cartPage.productQuantityCell(CART.quantityTest.productName),
        ).toHaveText(CART.quantityTest.quantity);
      });
    });
  });
});
