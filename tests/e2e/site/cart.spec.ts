import { randomUUID } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';
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
      const productsInCart = CART.products.slice(0, 2);

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
        for (const product of productsInCart) {
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

  test.describe('Test Case 17: Remove Products From Cart', () => {
    test('removes the selected product from the cart', async ({ page }) => {
      const cartPage = new CartPage(page);
      const productToRemove = CART.products[0];
      var productsToKeep = CART.products.slice(1);

      await test.step('Add two products and open the cart', async () => {
        await cartPage.openProducts();
        await expect(page).toHaveTitle(PRODUCTS.title);

        for(let i = 0; i < CART.products.length; i++)
        {
          await cartPage.addProductToCart(i);
          await expect(cartPage.addedHeading).toBeVisible();
          if(i < CART.products.length-1)
            await cartPage.continueShopping();
          else {
            await cartPage.viewCartFromDialog();
            await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
          }
        }
        
      });

      await test.step('Verify both products are in the cart', async () => {
        await expect(cartPage.productRow(productToRemove.name)).toBeVisible();
        await expect(cartPage.productRow(productsToKeep[0].name)).toBeVisible();
        await expect(cartPage.productRow(productsToKeep[1].name)).toBeVisible();
      });

      await test.step('Remove the selected product from the cart', async () => {
        await cartPage.removeProduct(productToRemove.name);
        await expect(cartPage.productRow(productToRemove.name)).toHaveCount(0);
      });

      await test.step('Verify the other cart product remains', async () => {
        await expect(cartPage.productRow(productsToKeep[0].name)).toBeVisible();
        await expect(cartPage.productRow(productsToKeep[1].name)).toBeVisible();
      });
    });
  });

  test.describe('Order placement with registration', () => {
    let accountEmail: string;
    let accountCreated = false;

    async function addProductsToCart(
      page: Page,
      cartPage: CartPage,
    ): Promise<void> {
      await test.step('Add products to the cart', async () => {
        await cartPage.openProducts();
        await expect(page).toHaveTitle(PRODUCTS.title);
        await expect(cartPage.allProductsHeading).toBeVisible();

        for (let productIndex = 0; productIndex < CART.products.length; productIndex++) {
          await cartPage.addProductToCart(productIndex);
          await expect(cartPage.addedHeading).toBeVisible();

          if (productIndex < CART.products.length - 1) {
            await cartPage.continueShopping();
          } else {
            await cartPage.viewCartFromDialog();
          }
        }

        await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
      });
    }

    async function verifyCartAndCheckoutDetails(
      cartPage: CartPage,
      checkoutPage: CheckoutPage,
    ): Promise<void> {
      await test.step('Verify cart contents and checkout details', async () => {
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
    }

    async function completeOrder(checkoutPage: CheckoutPage): Promise<void> {
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
    }

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
        accountCreated = false;
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

        await addProductsToCart(page, cartPage);

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

      await test.step('Return to the cart', async () => {
        await cartPage.openCart();
      });

      await verifyCartAndCheckoutDetails(cartPage, checkoutPage);
      await completeOrder(checkoutPage);

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

        await addProductsToCart(page, cartPage);
        await verifyCartAndCheckoutDetails(cartPage, checkoutPage);
        await completeOrder(checkoutPage);

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

          await addProductsToCart(page, cartPage);
          await verifyCartAndCheckoutDetails(cartPage, checkoutPage);
          await completeOrder(checkoutPage);

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

    test.describe('Test Case 23: Verify address details in checkout page', () => {
      test.setTimeout(60_000);

      test.beforeEach(async ({ page }) => {
        await page.route('https://googleads.g.doubleclick.net/**', (route) =>
          route.abort(),
        );
      });

      test('matches the registered address in delivery and billing details', async ({
        page,
      }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const homePage = new HomePage(page);
        const registerUserPage = new RegisterUserPage(page);
        const addressValues = [
          `Mr. ${registrationUser.firstName} ${registrationUser.lastName}`,
          registrationUser.company,
          registrationUser.address,
          registrationUser.address2,
          `${registrationUser.city} ${registrationUser.state} ${registrationUser.zipcode}`,
          registrationUser.country,
          registrationUser.mobileNumber,
        ];

        await test.step('Register a new account with test address details', async () => {
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

        await test.step('Add a product to the cart', async () => {
          await cartPage.openProducts();
          await expect(cartPage.allProductsHeading).toBeVisible();
          await cartPage.addProductToCart(0);
          await expect(cartPage.addedHeading).toBeVisible();
          await cartPage.viewCartFromDialog();
          await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
          await expect(cartPage.productRow(CART.products[0].name)).toBeVisible();
        });

        await test.step('Open checkout and verify delivery and billing addresses', async () => {
          await cartPage.proceedToCheckout();
          await expect(checkoutPage.deliveryAddressHeading).toBeVisible();
          await expect(checkoutPage.billingAddressHeading).toBeVisible();

          for (const addressValue of addressValues) {
            await expect(checkoutPage.addressDetail(addressValue)).toHaveCount(2);
          }
        });

        await test.step('Delete the test account and continue', async () => {
          await homePage.deleteAccount();
          await expect(homePage.deletedHeading).toBeVisible();
          accountCreated = false;
          await registerUserPage.continueAfterAccountDeletion();
          await expect(page).toHaveTitle(HOME.titlePattern);
        });
      });
    });

    test.describe('Test Case 24: Download Invoice after purchase order', () => {
        test.setTimeout(90_000);

        test.beforeEach(async ({ page }) => {
          await page.route('https://googleads.g.doubleclick.net/**', (route) =>
            route.abort(),
          );
        });

        test('downloads the invoice after completing an order', async ({
          page,
        }) => {
          const cartPage = new CartPage(page);
          const checkoutPage = new CheckoutPage(page);
          const homePage = new HomePage(page);
          const registerUserPage = new RegisterUserPage(page);

          await addProductsToCart(page, cartPage);

          await test.step('Start checkout and open the registration form', async () => {
            await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
            await cartPage.proceedToCheckout();
            await expect(cartPage.registerLoginLink).toBeVisible();
            await cartPage.registerLoginFromCheckout();
            await expect(page).toHaveURL(/\/login$/);
            await expect(registerUserPage.signupHeading).toBeVisible();
          });

          await test.step('Create an account and verify the logged-in user', async () => {
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
            await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
            await verifyCartAndCheckoutDetails(cartPage, checkoutPage);
          });

          await completeOrder(checkoutPage);

          await test.step('Download and verify the invoice', async () => {
            const downloadPromise = page.waitForEvent('download');
            await checkoutPage.downloadInvoice();
            const invoiceDownload = await downloadPromise;

            expect(invoiceDownload.suggestedFilename()).toMatch(/invoice/i);
            expect(await invoiceDownload.failure()).toBeNull();
            expect(await invoiceDownload.path()).not.toBeNull();
          });

          await test.step('Continue and delete the test account', async () => {
            await checkoutPage.continueAfterOrder();
            await expect(homePage.loggedInAs).toBeVisible();
            await homePage.deleteAccount();
            await expect(homePage.deletedHeading).toBeVisible();
            accountCreated = false;
            await registerUserPage.continueAfterAccountDeletion();
            await expect(page).toHaveTitle(HOME.titlePattern);
        });
      });
    });
  });
});
