import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmButton = page.getByRole('button', { name: 'CONFIRMAR' })
  }

  async goto() {
    await this.page.goto('/signup');
  }

  async fillSignupForm(data: {
    companyName: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    phoneNumber: string;
    country: string;
    city: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.page.fill('input[formControlName="companyName"]', data.companyName);
    await this.page.fill('input[formControlName="firstName"]', data.firstName);
    await this.page.fill('input[formControlName="lastName"]', data.lastName);
    await this.page.fill('input[formControlName="birthDate"]', data.birthDate);
    await this.page.fill('input[formControlName="phoneNumber"]', data.phoneNumber);
    await this.page.fill('input[formControlName="email"]', data.email);

    // Handle country selection
    await this.page.locator('mat-select[formcontrolname="country"]').click();
    await this.page.locator('mat-option', { hasText: data.country }).click();

    // Wait for cities to load and handle city selection
    await this.page.waitForTimeout(1000); // Wait for cities dropdown to update
    await this.page.locator('mat-select[formcontrolname="city"]').click();
    await this.page.locator('mat-option', { hasText: data.city }).click();

    await this.page.fill('input[formControlName="password"]', data.password);
    await this.page.fill('input[formControlName="confirmPassword"]', data.confirmPassword);
  }

  async submit() {
    await this.confirmButton.click();
  }

  async waitForErrorMessage(message: string) {
    await expect(this.page.locator('mat-error', { hasText: message })).toBeVisible();
  }
}
