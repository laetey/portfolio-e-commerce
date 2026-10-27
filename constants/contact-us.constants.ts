export const CONTACT_US = {
  formSelector: '#contact-us-form',
  heading: 'Get In Touch',
  successMessage:
    'Success! Your details have been submitted successfully.',
  successMessageSelector: '#contact-page .status.alert-success',
  nameField: '[name="name"]',
  emailField: '[name="email"]',
  subjectField: '[name="subject"]',
  messageField: '[name="message"]',
  fileField: '[name="upload_file"]',
  submitButtonName: 'Submit',
  homeButtonSelector: '#form-section a.btn-success',
  data: {
    name: 'Playwright Contact',
    email: 'playwright-contact@example.com',
    subject: 'Contact Us UI test',
    message: 'This message was submitted by an automated UI test.',
  },
} as const;
