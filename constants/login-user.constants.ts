export const LOGIN_USER = {
  route: '/login',
  loginForm: 'form[action="/login"]',
  heading: 'Login to your account',
  emailField: '[name="email"]',
  passwordField: '[name="password"]',
  loginButtonName: 'Login',
  invalidCredentialsError: 'Your email or password is incorrect!',
  invalidCredentials: {
    emailPrefix: 'invalid-login-',
    emailDomain: '@example.com',
    password: 'DefinitelyInvalid!2026',
  },
} as const;
