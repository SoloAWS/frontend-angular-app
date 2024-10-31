import { Page, Locator } from '@playwright/test';

export class IncidentCreatePage {
  readonly page: Page;
  readonly documentIdInput: Locator;
  readonly documentTypeSelect: Locator;
  readonly companySelect: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.documentIdInput = page.getByLabel('Número de identificación del usuario');
    this.documentTypeSelect = page.getByLabel('Tipo de documento');
    this.companySelect = page.getByLabel('Empresa');
    this.continueButton = page.getByRole('button', { name: 'CONTINUAR' });
  }

  async fillIncidentCreate(documentId: string, documentType: string, company: string) {
    await this.documentIdInput.fill(documentId);
    await this.documentTypeSelect.click();
    await this.page.getByRole('option', { name: documentType }).click();
    await this.page.waitForResponse(response =>
      response.url().includes('/user-management/user/companies') &&
      response.status() === 200
    );
    await this.companySelect.click();
    await this.page.getByRole('option', { name: company }).click();
    await this.continueButton.click();
  }
}
