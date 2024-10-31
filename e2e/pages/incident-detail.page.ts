import { Page, Locator } from '@playwright/test';

export class IncidentDetailPage {
  readonly page: Page;
  readonly prioritySelect: Locator;
  readonly descriptionInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.prioritySelect = page.getByLabel('Prioridad');
    this.descriptionInput = page.getByLabel('Descripción del incidente...');
    this.submitButton = page.getByRole('button', { name: 'REGISTRAR INCIDENTE' });
  }

  async fillIncidentDetails(priority: string, description: string) {
    await this.prioritySelect.click();
    await this.page.getByRole('option', { name: priority }).click();
    await this.descriptionInput.fill(description);
    await this.submitButton.click();
  }
}
