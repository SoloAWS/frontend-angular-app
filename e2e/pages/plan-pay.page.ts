// e2e/pages/plan-pay.page.ts
import { Page } from '@playwright/test';

export class PlanPayPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillPaymentForm(data: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    cardHolderName: string;
  }) {
    await this.page.fill('input[formControlName="cardNumber"]', data.cardNumber);
    await this.page.fill('input[formControlName="expirationDate"]', data.expirationDate);
    await this.page.fill('input[formControlName="cvv"]', data.cvv);
    await this.page.fill('input[formControlName="cardHolderName"]', data.cardHolderName);
  }

  async submitPayment() {
    await this.page.click('button:text("REALIZAR PAGO")');
  }
}
