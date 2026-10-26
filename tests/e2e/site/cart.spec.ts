import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { CART } from '../../../constants/cart.constants';
import { CHECKOUT } from '../../../constants/checkout.constants';
import { HOME } from '../../../constants/home.constants';
import { PRODUCTS } from '../../../constants/products.constants';
import { REGISTER_USER } from '../../../constants/register-user.constants';
import { SUBSCRIPTION } from '../../../constants/subscription.constants';
import { CartPage } from '../../../pages/cart.page';
import { CheckoutPage } from '../../../pages/checkout.page';
import { HomePage } from '../../../pages/home.page';
import { LoginPage } from '../../../pages/login.page';
import { RegisterUserPage } from '../../../pages/register-user.page';
import registrationUser from '../../../test-data/users.json';

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

  test.describe('Order placement with registration', () => {
    let accountEmail: string;
    let accountCreated = false;

    test.beforeEach(async () => {
      accountEmail = `${registrationUser.emailPrefix}${randomUUID()}${registrationUser.emailDomain}`;
      accountCreated = false;
    });

    test.afterEach(async ({ page }) => {
      if (!accountCreated) {
        return;
      }

      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);

      await test.step('Delete the test account if the scenario exits early', async () => {
        await homePage.gotoHome();
        await homePage.dismissConsentIfVisible();

        if (!(await homePage.loggedInAs.isVisible())) {
          await homePage.openLogin();
          await loginPage.login(accountEmail, registrationUser.password);
          await expect(homePage.loggedInAs).toBeVisible();
        }

        await homePage.deleteAccount();
        await expect(homePage.deletedHeading).toBeVisible();
      });
    });

    test.describe('Test Case 14: Place Order: Register while Checkout', () => {
      test('registers during checkout and completes an order', async ({
        page,
      }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const registerUserPage = new RegisterUserPage(page);
        const homePage = new HomePage(page);

        await test.step('Add products to the cart', async () => {
          await cartPage.openProducts();
          await expect(page).toHaveTitle(PRODUCTS.title);

          await cartPage.addProductToCart(0);
          await expect(cartPage.addedHeading).toBeVisible();
          await cartPage.continueShopping();

          await cartPage.addProductToCart(1);
          await expect(cartPage.addedHeading).toBeVisible();
          await cartPage.viewCartFromDialog();
          await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
        });

        await test.step('Start checkout and choose Register / Login', async () => {
          await cartPage.proceedToCheckout();
          await expect(cartPage.registerLoginLink).toBeVisible();
          await cartPage.registerLoginFromCheckout();
          await expect(page).toHaveURL(/\/login$/);
          await expect(registerUserPage.signupHeading).toBeVisible();
      });

      await test.step('Create an account from the checkout flow', async () => {
        await registerUserPage.startRegistration(
          registrationUser.name,
          accountEmail,
        );
        await expect(registerUserPage.accountHeading).toBeVisible();
        await registerUserPage.completeRegistration(registrationUser);
        await expect(registerUserPage.accountCreatedHeading).toBeVisible();
        accountCreated = true;
        await registerUserPage.continueAfterAccountCreation();
        await expect(homePage.loggedInAs).toBeVisible();
      });

      await test.step('Return to the cart and verify checkout details', async () => {
        await cartPage.openCart();
        await cartPage.proceedToCheckout();
        await expect(checkoutPage.deliveryAddressHeading).toBeVisible();
        await expect(checkoutPage.billingAddressHeading).toBeVisible();
        await expect(checkoutPage.reviewOrderHeading).toBeVisible();
        await expect(
          checkoutPage.addressDetail(
            `Mr. ${registrationUser.firstName} ${registrationUser.lastName}`,
          ),
        ).toHaveCount(2);
        await expect(
          checkoutPage.addressDetail(registrationUser.address),
        ).toHaveCount(2);

        for (const product of CART.products) {
          await expect(cartPage.productRow(product.name)).toBeVisible();
        }
      });

      await test.step('Enter an order comment and place the order', async () => {
        await checkoutPage.enterOrderComment(CHECKOUT.comment);
        await checkoutPage.placeOrder();
        await expect(checkoutPage.paymentHeading).toBeVisible();
      });

      await test.step('Submit payment details and confirm the order', async () => {
        await checkoutPage.enterPaymentDetails();
        await checkoutPage.payAndConfirmOrder();
        await expect(checkoutPage.orderSuccessMessage).toBeVisible();
      });

      await test.step('Delete the account created during checkout', async () => {
        await homePage.deleteAccount();
        await expect(homePage.deletedHeading).toBeVisible();
        accountCreated = false;
        await page
          .getByRole('link', {
            name: REGISTER_USER.confirmation.continueLinkName,
            exact: true,
          })
          .click();
        });
      });
    });

    test.describe('Test Case 15: Place Order: Register before Checkout', () => {
      test('registers before checkout and completes an order', async ({ page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const homePage = new HomePage(page);
        const registerUserPage = new RegisterUserPage(page);

        await test.step('Register a new account before shopping', async () => {
          await homePage.openLogin();
          await expect(registerUserPage.signupHeading).toBeVisible();
          await registerUserPage.startRegistration(
            registrationUser.name,
            accountEmail,
          );
          await expect(registerUserPage.accountHeading).toBeVisible();
          await registerUserPage.completeRegistration(registrationUser);
          await expect(registerUserPage.accountCreatedHeading).toBeVisible();
          accountCreated = true;
          await registerUserPage.continueAfterAccountCreation();
          await expect(homePage.loggedInAs).toBeVisible();
        });

        await test.step('Add two products and open the cart', async () => {
          await cartPage.openProducts();
          await expect(page).toHaveTitle(PRODUCTS.title);
          await expect(cartPage.allProductsHeading).toBeVisible();

          await cartPage.addProductToCart(0);
          await expect(cartPage.addedHeading).toBeVisible();
          await cartPage.continueShopping();

          await cartPage.addProductToCart(1);
          await expect(cartPage.addedHeading).toBeVisible();
          await cartPage.viewCartFromDialog();
          await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
        });

        await test.step('Verify the cart and checkout address details', async () => {
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

          await cartPage.proceedToCheckout();
          await expect(checkoutPage.deliveryAddressHeading).toBeVisible();
          await expect(checkoutPage.billingAddressHeading).toBeVisible();
          await expect(checkoutPage.reviewOrderHeading).toBeVisible();
          await expect(
            checkoutPage.addressDetail(
              `Mr. ${registrationUser.firstName} ${registrationUser.lastName}`,
            ),
          ).toHaveCount(2);
          await expect(
            checkoutPage.addressDetail(registrationUser.address),
          ).toHaveCount(2);
        });

        await test.step('Enter an order comment and place the order', async () => {
          await checkoutPage.enterOrderComment(CHECKOUT.comment);
          await checkoutPage.placeOrder();
          await expect(checkoutPage.paymentHeading).toBeVisible();
        });

        await test.step('Submit payment and verify the order confirmation', async () => {
          await checkoutPage.enterPaymentDetails();
          await checkoutPage.payAndConfirmOrder();
          await expect(checkoutPage.orderSuccessMessage).toBeVisible();
        });

        await test.step('Delete the registered account', async () => {
          await homePage.deleteAccount();
          await expect(homePage.deletedHeading).toBeVisible();
          accountCreated = false;
          await page
            .getByRole('link', {
              name: REGISTER_USER.confirmation.continueLinkName,
              exact: true,
            })
            .click();
        });
      });
    });

    test.describe('Test Case 16: Place Order: Login before Checkout', () => {
        test.beforeEach(async ({ page }) => {
          const homePage = new HomePage(page);
          const registerUserPage = new RegisterUserPage(page);

          await test.step('Create and log out of the account used by this test', async () => {
            await homePage.openLogin();
            await expect(registerUserPage.signupHeading).toBeVisible();
            await registerUserPage.startRegistration(
              registrationUser.name,
              accountEmail,
            );
            await expect(registerUserPage.accountHeading).toBeVisible();
            await registerUserPage.completeRegistration(registrationUser);
            await expect(registerUserPage.accountCreatedHeading).toBeVisible();
            accountCreated = true;
            await registerUserPage.continueAfterAccountCreation();
            await expect(homePage.loggedInAs).toBeVisible();
            await homePage.logout();
            await expect(homePage.loggedInAs).not.toBeVisible();
          });
        });

        test('logs in before checkout and completes an order', async ({ page }) => {
          const cartPage = new CartPage(page);
          const checkoutPage = new CheckoutPage(page);
          const homePage = new HomePage(page);
          const loginPage = new LoginPage(page);

          await test.step('Log in before adding products', async () => {
            await homePage.openLogin();
            await expect(loginPage.heading).toBeVisible();
            await loginPage.login(accountEmail, registrationUser.password);
            await expect(homePage.loggedInAs).toBeVisible();
          });

          await test.step('Add two products and open the cart', async () => {
            await cartPage.openProducts();
            await expect(page).toHaveTitle(PRODUCTS.title);
            await expect(cartPage.allProductsHeading).toBeVisible();

            await cartPage.addProductToCart(0);
            await expect(cartPage.addedHeading).toBeVisible();
            await cartPage.continueShopping();

            await cartPage.addProductToCart(1);
            await expect(cartPage.addedHeading).toBeVisible();
            await cartPage.viewCartFromDialog();
            await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
          });

          await test.step('Verify cart contents and checkout address details', async () => {
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

            await cartPage.proceedToCheckout();
            await expect(checkoutPage.deliveryAddressHeading).toBeVisible();
            await expect(checkoutPage.billingAddressHeading).toBeVisible();
            await expect(checkoutPage.reviewOrderHeading).toBeVisible();
            await expect(
              checkoutPage.addressDetail(
                `Mr. ${registrationUser.firstName} ${registrationUser.lastName}`,
              ),
            ).toHaveCount(2);
            await expect(
              checkoutPage.addressDetail(registrationUser.address),
            ).toHaveCount(2);
          });

          await test.step('Enter an order comment and place the order', async () => {
            await checkoutPage.enterOrderComment(CHECKOUT.comment);
            await checkoutPage.placeOrder();
            await expect(checkoutPage.paymentHeading).toBeVisible();
          });

          await test.step('Submit payment and confirm the order', async () => {
            await checkoutPage.enterPaymentDetails();
            await checkoutPage.payAndConfirmOrder();
            await expect(checkoutPage.orderSuccessMessage).toBeVisible();
          });

          await test.step('Delete the account used for checkout', async () => {
            await homePage.deleteAccount();
            await expect(homePage.deletedHeading).toBeVisible();
            accountCreated = false;
            await page
              .getByRole('link', {
                name: REGISTER_USER.confirmation.continueLinkName,
                exact: true,
              })
              .click();
        });
      });
    });
  });
});
