export const CART = {
  route: '/view_cart',
  addToCartText: 'Add to cart',
  addedHeading: 'Added!',
  continueShoppingButton: 'Continue Shopping',
  viewCartLink: 'View Cart',
  quantityTest: {
    productName: 'Blue Top',
    quantity: '4',
  },
  products: [
    {
      name: 'Blue Top',
      price: 'Rs. 500',
      quantity: '1',
      total: 'Rs. 500',
    },
    {
      name: 'Men Tshirt',
      price: 'Rs. 400',
      quantity: '1',
      total: 'Rs. 400',
    },
  ],
} as const;
