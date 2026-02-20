import { type Locator, type Page } from '@playwright/test';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export class ContactFormPage {
  readonly page: Page;
  
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly contactHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.nameInput = page.getByRole('textbox', { name: 'Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.subjectInput = page.getByRole('textbox', { name: 'Subject' });
    this.messageInput = page.getByTestId('ContactDescription');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.contactHeading = page.getByRole('heading', { name: 'Send Us a Message' });
  }

  async navigateToHome() {
    await this.page.goto('https://automationintesting.online/');
  }

  async scrollToContactForm() {
    await this.contactHeading.scrollIntoViewIfNeeded();
  }

  async fillContactForm(contactData: ContactFormData) {
    await this.nameInput.fill(contactData.name);
    await this.emailInput.fill(contactData.email);
    await this.phoneInput.fill(contactData.phone);
    await this.subjectInput.fill(contactData.subject);
    await this.messageInput.fill(contactData.message);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async fillAndSubmitContactForm(contactData: ContactFormData) {
    await this.scrollToContactForm();
    await this.fillContactForm(contactData);
    await this.submitForm();
  }

  async getMessageValue(): Promise<string> {
    return await this.messageInput.inputValue();
  }
}