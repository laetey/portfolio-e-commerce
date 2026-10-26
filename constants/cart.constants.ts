export const CART = {
  route: '/view_cart',
  addToCartText: 'Add to cart',
  removeProductSelector: 'a.cart_quantity_delete',
  addedHeading: 'Added!',
  continueShoppingButton: 'Continue Shopping',
  viewCartLink: 'View Cart',
  proceedToCheckout: 'Proceed To Checkout',
  registerLoginLink: 'Register / Login',
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
    {
      name: 'Sleeveless Dress',
      price: 'Rs. 1000',
      quantity: '1',
      total: 'Rs. 1000',
    },
  ],
} as const;
