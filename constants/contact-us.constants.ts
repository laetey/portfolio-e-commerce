export const CONTACT_US = {
  heading: 'Get In Touch',
  successMessage:
    'Success! Your details have been submitted successfully.',
  nameField: '[name="name"]',
  emailField: '[name="email"]',
  subjectField: '[name="subject"]',
  messageField: '[name="message"]',
  fileField: '[name="upload_file"]',
  submitButtonName: 'Submit',
  homeButtonName: 'Home',
  data: {
    name: 'Playwright Contact',
    email: 'playwright-contact@example.com',
    subject: 'Contact Us UI test',
    message: 'This message was submitted by an automated UI test.',
  },
} as const;
