import { expect, test } from '@playwright/test';
import { ApiClient } from '../../api/clients/api-client';
import { API_MESSAGES } from '../../api/constants/api.constants';
import type {
  BrandListResponse,
  ProductListResponse,
} from '../../api/models/product';
import { ProductsService } from '../../api/services/products.service';

test.describe('Product API scenarios', () => {
  let productsService: ProductsService;

  test.beforeEach(({ request }) => {
    productsService = new ProductsService(new ApiClient(request));
  });

  test('returns the products list', async () => {
    let responseBody: ProductListResponse;

    await test.step('Request the products list', async () => {
      const response = await productsService.getAllProducts();
      expect(response.status()).toBe(200);
      responseBody = await response.json() as ProductListResponse;
    });

    await test.step('Verify the response code and product data', async () => {
      expect(responseBody.responseCode).toBe(200);
      expect(responseBody.products.length).toBeGreaterThan(0);

      for (const product of responseBody.products) {
        expect(product).toEqual(expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(String),
          brand: expect.any(String),
          category: expect.objectContaining({
            usertype: expect.objectContaining({
              usertype: expect.any(String),
            }),
            category: expect.any(String),
          }),
        }));
      }
    });
  });

  test.describe('API 2: POST To All Products List', () => {
    let productsService: ProductsService;

    test.beforeEach(({ request }) => {
      productsService = new ProductsService(new ApiClient(request));
    });

    test('rejects the unsupported POST method', async () => {
      await test.step('Send a POST request to the products list', async () => {
        const response = await productsService.postAllProducts();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toEqual({
          responseCode: 405,
          message: API_MESSAGES.methodNotSupported,
        });
      });
    });
  });

  test.describe('API 3: Get All Brands List', () => {
    let productsService: ProductsService;

    test.beforeEach(({ request }) => {
      productsService = new ProductsService(new ApiClient(request));
    });

    test('returns the brands list', async () => {
      let responseBody: BrandListResponse;

      await test.step('Request the brands list', async () => {
        const response = await productsService.getAllBrands();
        expect(response.status()).toBe(200);
        responseBody = await response.json() as BrandListResponse;
      });

      await test.step('Verify the response code and brand data', async () => {
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.brands.length).toBeGreaterThan(0);

        for (const brand of responseBody.brands) {
          expect(brand).toEqual(expect.objectContaining({
            id: expect.any(Number),
            brand: expect.any(String),
          }));
        }
      });
    });
  });

  test.describe('API 4: PUT To All Brands List', () => {
    let productsService: ProductsService;

    test.beforeEach(({ request }) => {
      productsService = new ProductsService(new ApiClient(request));
    });

    test('rejects the unsupported PUT method', async () => {
      await test.step('Send a PUT request to the brands list', async () => {
        const response = await productsService.putAllBrands();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toEqual({
          responseCode: 405,
          message: API_MESSAGES.methodNotSupported,
        });
      });
    });
  });

  test.describe('API 5: POST To Search Product', () => {
    let productsService: ProductsService;

    test.beforeEach(({ request }) => {
      productsService = new ProductsService(new ApiClient(request));
    });

    test('returns products matching the search term', async () => {
      const searchTerm = 'jean';
      let responseBody: ProductListResponse;

      await test.step(`Search products for ${searchTerm}`, async () => {
        const response = await productsService.searchProducts(searchTerm);
        expect(response.status()).toBe(200);
        responseBody = await response.json() as ProductListResponse;
      });

      await test.step('Verify matching product results are returned', async () => {
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products.length).toBeGreaterThan(0);
        expect(responseBody.products.every(({ name }) =>
          name.toLowerCase().includes(searchTerm.toLowerCase()),
        )).toBe(true);
      });
    });
  });

  test.describe('API 6: POST To Search Product without search_product parameter', () => {
    let productsService: ProductsService;

    test.beforeEach(({ request }) => {
      productsService = new ProductsService(new ApiClient(request));
    });

    test('reports the missing search_product parameter', async () => {
      await test.step('Search products without a search term', async () => {
        const response = await productsService.searchProducts();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toEqual({
          responseCode: 400,
          message: API_MESSAGES.searchProductParameterMissing,
        });
      });
    });
  });
});
