export const PRODUCTS = {
  route: '/products',
  title: 'Automation Exercise - All Products',
  allProductsHeading: 'All Products',
  viewProductLinkName: 'View Product',
  brandsHeading: 'Brands',
  brandProducts: {
    brands: ['Polo', 'H&M'],
    headingPrefix: 'Brand - ',
    headingSuffix: ' Products',
  },
  productDetailsTitle: 'Automation Exercise - Product Details',
  search: {
    inputLabel: 'Search Product',
    buttonAccessibleName: '\uf002',
    heading: 'Searched Products',
    productName: 'Blue Top',
  },
  firstProduct: {
    name: 'Blue Top',
    category: 'Category: Women > Tops',
    price: 'Rs. 500',
    availability: 'Availability: In Stock',
    condition: 'Condition: New',
    brand: 'Brand: Polo',
  },
} as const;
