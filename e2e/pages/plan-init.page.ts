// e2e/pages/plan-init.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class PlanInitPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickSelectPlan() {
    await this.page.click('button:text("SELECCIONAR PLAN")');
  }
}

// e2e/pages/plan-select.page.ts
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
