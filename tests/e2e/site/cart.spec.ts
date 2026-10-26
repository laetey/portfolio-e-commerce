import { expect, test } from '@playwright/test';
import { CART } from '../../../constants/cart.constants';
import { HOME } from '../../../constants/home.constants';
import { SUBSCRIPTION } from '../../../constants/subscription.constants';
import { CartPage } from '../../../pages/cart.page';
import { HomePage } from '../../../pages/home.page';

test.describe('Test Case 11: Verify Subscription in Cart page', () => {
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
