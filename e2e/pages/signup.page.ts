import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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
    await this.page.selectOption('select[formControlName="country"]', data.country);
    await this.page.selectOption('select[formControlName="city"]', data.city);
    await this.page.fill('input[formControlName="email"]', data.email);
    await this.page.fill('input[formControlName="password"]', data.password);
    await this.page.fill('input[formControlName="confirmPassword"]', data.confirmPassword);
  }

  async submit() {
    await this.page.click('button:text("CONFIRMAR")');
  }
}
