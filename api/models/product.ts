export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: {
      usertype: string;
    };
    category: string;
  };
}

export interface ProductListResponse {
  responseCode: number;
  message?: string;
  products: Product[];
}

export interface BrandListResponse {
  responseCode: number;
  brands: Array<{
    id: number;
    brand: string;
  }>;
}
