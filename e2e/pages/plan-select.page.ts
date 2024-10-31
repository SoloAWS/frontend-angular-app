// e2e/pages/plan-select.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class PlanSelectPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPlansToLoad() {
    await this.page.waitForResponse(
      response => response.url().includes('/billing-manager/plans')
    );
  }

  async selectPlan(planName: string) {
    const planCard = this.page.locator('.plan-card', { has: this.page.locator('.card-name', { hasText: planName }) });
    await planCard.locator('button:text("SELECCIONAR PLAN")').click();
  }
}
