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
  
  async clickSimilarIncidentsButton() {
    await this.page.getByRole('button', { name: 'BUSCAR PROBLEMAS SIMILARES' }).click();
  }

  async clickAIResponseButton() {
    await this.page.getByRole('button', { name: 'GENERAR POSIBLES RESPUESTAS' }).click();
  }

  async getSimilarIncidentsSuggestions(): Promise<string> {
    return await this.page.locator('textarea').first().inputValue();
  }

  async getAIResponse(): Promise<string> {
    return await this.page.locator('textarea').nth(1).inputValue();
  }

  async getErrorToast(): Promise<string> {
    const toastMessage = await this.page.getByText('La descripción del incidente es requerida');
    return await toastMessage.textContent() || '';
  }
}