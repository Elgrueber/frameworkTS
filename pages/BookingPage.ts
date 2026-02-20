import { type Locator, type Page } from '@playwright/test';

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class BookingPage {
  readonly page: Page;

  readonly bookNowMainLink: Locator;
  readonly welcomeHeading: Locator;

  readonly singleRoomBookButton: Locator;
  readonly doubleRoomBookButton: Locator;
  readonly suiteRoomBookButton: Locator;

  readonly checkInInput: Locator;
  readonly checkOutInput: Locator;
  readonly checkAvailabilityButton: Locator;

  readonly reserveNowButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly cancelButton: Locator;

  readonly bookingConfirmedText: Locator;
  readonly confirmationHeading: Locator;
  readonly confirmationMessage: Locator;
  readonly returnHomeButton: Locator;
  readonly applicationErrorHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.bookNowMainLink = page.getByRole('link', { name: 'Book Now', exact: true });
    this.welcomeHeading = page.getByText('Welcome to Shady Meadows B&B');

    this.singleRoomBookButton = page.getByRole('link', { name: 'Book now' }).nth(1);
    this.doubleRoomBookButton = page.getByRole('link', { name: 'Book now' }).nth(2);
    this.suiteRoomBookButton = page.getByRole('link', { name: 'Book now' }).nth(3);

    this.checkInInput = page.locator('input').nth(0);
    this.checkOutInput = page.locator('input').nth(1);
    this.checkAvailabilityButton = page.getByRole('button', { name: 'Check Availability' });

    this.reserveNowButton = page.getByRole('button', { name: 'Reserve Now' });
    this.firstNameInput = page.getByRole('textbox', { name: 'Firstname' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Lastname' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });

    this.bookingConfirmedText = page.getByText('Booking Confirmed');
    this.confirmationHeading = page.getByRole('heading', { name: 'Booking Confirmed' });
    this.confirmationMessage = page.getByText('Your booking has been confirmed for the following dates:');
    this.returnHomeButton = page.getByRole('link', { name: 'Return home' });
    this.applicationErrorHeading = page.getByRole('heading', { name: /Application error/i });
  }

  async navigateToHome() {
    await this.page.goto('https://automationintesting.online/');
  }

  async selectDates(checkInDate: string, checkOutDate: string) {

    await this.checkInInput.clear();
    await this.checkInInput.fill(checkInDate);
    
    await this.checkOutInput.clear();
    await this.checkOutInput.fill(checkOutDate);

    await this.checkAvailabilityButton.click();
    
    await this.page.waitForTimeout(2000);
    
    await this.page.waitForSelector('text="Book now"', { timeout: 10000 });
  }

  async selectSingleRoom() {
    await this.singleRoomBookButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.singleRoomBookButton.click();
  }

  async selectDoubleRoom() {
    // Wait for rooms to be available after date selection
    await this.doubleRoomBookButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.doubleRoomBookButton.click();
  }

  async selectSuiteRoom() {
    await this.suiteRoomBookButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.suiteRoomBookButton.click();
  }

  async proceedToGuestDetails() {
    await this.reserveNowButton.click();
  }

  async fillGuestDetails(guestDetails: GuestDetails) {
    await this.firstNameInput.fill(guestDetails.firstName);
    await this.lastNameInput.fill(guestDetails.lastName);
    await this.emailInput.fill(guestDetails.email);
    await this.phoneInput.fill(guestDetails.phone);
  }

  async submitBooking() {
    await this.reserveNowButton.click();
  }

  async waitForConfirmation(timeoutMs: number = 3000) {
    await new Promise(resolve => setTimeout(resolve, timeoutMs));
  }

  async cancelBooking() {
    await this.cancelButton.click();
  }
}