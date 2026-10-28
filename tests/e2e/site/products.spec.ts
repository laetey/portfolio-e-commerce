import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { CART } from '../../../constants/cart.constants';
import { HOME } from '../../../constants/home.constants';
import { PRODUCTS } from '../../../constants/products.constants';
import { CartPage } from '../../../pages/cart.page';
import { HomePage } from '../../../pages/home.page';
import { LoginPage } from '../../../pages/login.page';
import { ProductsPage } from '../../../pages/products.page';
import { RegisterUserPage } from '../../../pages/register-user.page';
import registrationUser from '../../../test-data/users.json';

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

test.describe('Test Case 20: Search Products and Verify Cart After Login', () => {
  test.setTimeout(60_000);

  let accountEmail: string;
  let accountCreated = false;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    const registerUserPage = new RegisterUserPage(page);

    accountEmail = `${registrationUser.emailPrefix}${randomUUID()}${registrationUser.emailDomain}`;
    accountCreated = false;
    await page.route('https://googleads.g.doubleclick.net/**', (route) =>
      route.abort(),
    );

    await test.step('Open the home page and verify it is visible', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });

    await test.step('Create an account to use for the login scenario', async () => {
      await homePage.openLogin();
      await expect(registerUserPage.signupHeading).toBeVisible();
      await registerUserPage.startRegistration(registrationUser.name, accountEmail);
      await expect(registerUserPage.accountHeading).toBeVisible();
      await registerUserPage.completeRegistration(registrationUser);
      await expect(registerUserPage.accountCreatedHeading).toBeVisible();
      accountCreated = true;
      await registerUserPage.continueAfterAccountCreation();
      await expect(homePage.loggedInAs).toBeVisible();
      await homePage.logout();
    });
  });

  test.afterEach(async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    if (accountCreated) {
      await test.step('Delete the registered account after the scenario', async () => {
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
    }

    await test.step('Return to the home page after the scenario', async () => {
      await homePage.gotoHome();
      await homePage.dismissConsentIfVisible();
      await expect(page).toHaveTitle(HOME.titlePattern);
    });
  });

  test('keeps searched products in the cart after login', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const loginPage = new LoginPage(page);
    const productName = PRODUCTS.search.productName;

    await test.step('Open Products and verify the product catalog', async () => {
      await productsPage.gotoProducts();
      await expect(page).toHaveTitle(PRODUCTS.title);
      await expect(productsPage.allProductsHeading).toBeVisible();
    });

    await test.step('Search and verify the matching product', async () => {
      await productsPage.searchForProduct(productName);
      await expect(productsPage.searchedProductsHeading).toBeVisible();
      await expect(productsPage.searchedProductCards).toHaveCount(1);
      await expect(productsPage.searchedProductCards).toBeVisible();
    });

    await test.step('Add the searched product to the cart', async () => {
      await cartPage.addProductToCart(0);
      await expect(cartPage.addedHeading).toBeVisible();
      await cartPage.viewCartFromDialog();
      await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
      await expect(cartPage.productRow(productName)).toBeVisible();
    });

    await test.step('Log in with the registered account', async () => {
      await homePage.openLogin();
      await expect(loginPage.heading).toBeVisible();
      await loginPage.login(accountEmail, registrationUser.password);
      await expect(homePage.loggedInAs).toBeVisible();
    });

    await test.step('Verify the searched product remains in the cart after login', async () => {
      await cartPage.openCart();
      await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
      await expect(cartPage.productRow(productName)).toBeVisible();
    });
  });
});

test.describe('Test Case 21: Add review on product', () => {
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

  test('submits a review for the first product', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const reviewerEmail = `${PRODUCTS.review.emailPrefix}${randomUUID()}${PRODUCTS.review.emailDomain}`;

    await test.step('Open Products and verify the product catalog', async () => {
      await productsPage.gotoProducts();
      await expect(page).toHaveTitle(PRODUCTS.title);
      await expect(productsPage.allProductsHeading).toBeVisible();
    });

    await test.step('Open the first product and verify the review form', async () => {
      await productsPage.openFirstProduct();
      await expect(page).toHaveTitle(PRODUCTS.productDetailsTitle);
      await expect(productsPage.firstProductHeading).toBeVisible();
      await expect(productsPage.reviewLink).toBeVisible();
    });

    await test.step('Submit a product review', async () => {
      await productsPage.submitReview(
        PRODUCTS.review.reviewerName,
        reviewerEmail,
        PRODUCTS.review.text,
      );
    });

    await test.step('Verify the review submission confirmation', async () => {
      await expect(productsPage.reviewSuccessMessage).toBeVisible();
    });
  });
});

test.describe('Test Case 22: Add to cart from Recommended items', () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await page.route('https://googleads.g.doubleclick.net/**', (route) =>
      route.abort(),
    );

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

  test('adds a recommended product to the cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    let recommendedProductName = '';

    await test.step('Scroll to and verify Recommended Items', async () => {
      await homePage.scrollToRecommendedItems();
      await expect(homePage.recommendedItemsHeading).toBeVisible();
      await expect(homePage.activeRecommendedProductName).toBeVisible();
    });

    await test.step('Add the active recommended product to the cart', async () => {
      recommendedProductName = (
        await homePage.activeRecommendedProductName.textContent()
      )?.trim() ?? '';
      expect(recommendedProductName).not.toBe('');

      await homePage.addActiveRecommendedProductToCart();
      await expect(cartPage.addedHeading).toBeVisible();
    });

    await test.step('Open the cart and verify the recommended product', async () => {
      await cartPage.viewCartFromDialog();
      await expect(page).toHaveURL(new RegExp(`${CART.route}$`));
      await expect(cartPage.productRow(recommendedProductName)).toBeVisible();
    });
  });
});

test.describe("Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await page.route('https://googleads.g.doubleclick.net/**', (route) =>
      route.abort(),
    );

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

  test('scrolls to the footer and back to the top with the arrow', async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await test.step('Scroll to the bottom and verify Subscription', async () => {
      await homePage.scrollToBottom();
      await expect(homePage.subscriptionHeading).toBeVisible();
    });

    await test.step('Use the arrow to scroll back to the top', async () => {
      await expect(homePage.scrollUpArrow).toBeVisible();
      await homePage.scrollToTopWithArrow();
      await expect(homePage.tagline).toBeInViewport();
    });
  });
});

test.describe("Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await page.route('https://googleads.g.doubleclick.net/**', (route) =>
      route.abort(),
    );

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

  test('scrolls to the footer and back to the top without the arrow', async ({
    page,
  }) => {
    const homePage = new HomePage(page);

    await test.step('Scroll to the bottom and verify Subscription', async () => {
      await homePage.scrollToBottom();
      await expect(homePage.subscriptionHeading).toBeVisible();
    });

    await test.step('Scroll to the top without using the arrow', async () => {
      await homePage.scrollToTopWithoutArrow();
      await expect(homePage.tagline).toBeInViewport();
    });
  });
});
