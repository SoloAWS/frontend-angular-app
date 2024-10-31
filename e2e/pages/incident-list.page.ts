// e2e/pages/incident-list.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class IncidentListPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly table: Locator;
  readonly clearButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByLabel('Buscar por ID de incidente, cliente o descripción...');
    this.table = page.locator('table.mat-table');
    this.clearButton = page.getByRole('button', { name: 'Clear' });
  }

  async searchIncident(searchText: string) {
    await this.searchInput.fill(searchText);
  }

  async clearSearch() {
    await this.clearButton.click();
  }

  async findIncidentByDescription(description: string) {
    return this.table.locator('tr.mat-row', {
      has: this.page.locator('td.mat-cell', { hasText: description })
    });
  }

  async verifyIncidentDetails(incidentRow: Locator, expectedDetails: {
    company?: string;
    state?: string;
    channel?: string;
    description?: string;
  }) {
    if (expectedDetails.company) {
      await expect(incidentRow.locator('td', { hasText: expectedDetails.company })).toBeVisible();
    }
    if (expectedDetails.state) {
      await expect(incidentRow.locator('td', { hasText: expectedDetails.state })).toBeVisible();
    }
    if (expectedDetails.channel) {
      await expect(incidentRow.locator('td', { hasText: expectedDetails.channel })).toBeVisible();
    }
    if (expectedDetails.description) {
      await expect(incidentRow.locator('td', { hasText: expectedDetails.description })).toBeVisible();
    }
  }
}
