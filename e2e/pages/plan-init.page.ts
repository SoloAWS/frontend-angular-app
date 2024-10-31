// e2e/pages/plan-init.page.ts

import { Page, Locator, expect } from '@playwright/test';
export class PlanInitPage {
  readonly page: Page;
  readonly selectPlan: Locator;

  constructor(page: Page) {
    this.page = page;
    this.selectPlan = page.getByRole('button', { name: 'SELECCIONAR PLAN' })
  }

  async goto() {
    await this.page.goto('/plan/init');
  }

  async clickSelectPlan() {
    await this.selectPlan.click();
  }
}
