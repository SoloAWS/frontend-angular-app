import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginPage } from '../pages/login.page';
import { IncidentCreatePage } from '../pages/incident-create.page';
import { IncidentDetailPage } from '../pages/incident-detail.page';
import { TEST_DATA } from '../fixtures/test-data';

test.describe('Incident Creation Flow', () => {
  let loginPage: LoginPage;
  let incidentCreatePage: IncidentCreatePage;
  let incidentDetailPage: IncidentDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    incidentCreatePage = new IncidentCreatePage(page);
    incidentDetailPage = new IncidentDetailPage(page);
  });

  test('should create a new incident', async ({ page }) => {
    // 1. Login
    await loginPage.goto();
    await loginPage.login(TEST_DATA.login.email, TEST_DATA.login.password);

    // Wait for successful login and dashboard to load
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Navigate to Create Incident
    await page.locator('mat-list-item', { hasText: 'Crear Nuevo Incidente' }).click();
    await expect(page).toHaveURL(/.*incident\/create/);

    // 3 & 4. Fill incident create form
    await incidentCreatePage.fillIncidentCreate(
      TEST_DATA.incident.documentId,
      TEST_DATA.incident.documentType,
      TEST_DATA.incident.company
    );

    // 5. Fill incident details
    await expect(page).toHaveURL(/.*incident\/details/);
    await page.waitForTimeout(3300);
    const description = faker.lorem.sentence().substring(0, 100);
    await incidentDetailPage.fillIncidentDetails(
      TEST_DATA.incident.priority,
      description
    );

    // 6. Verify success toast and incident creation
    await expect(page.getByText('Status: 200')).toBeVisible();

    // Refresh and verify incident appears in history
    await page.reload();
    await expect(page.getByText(description)).toBeVisible();

    // 7. Navigate to Incident List
    await page.locator('mat-list-item', { hasText: 'Consultar Incidente' }).click();
    await expect(page).toHaveURL(/.*incident\/list/);

    // 8. Verify the newly created incident appears in the list
    // Wait for the table to be loaded
    const table = page.locator('table.mat-mdc-table');
    await expect(table).toBeVisible();

    // Wait for network request to complete
    await page.waitForResponse(response =>
      response.url().includes('/incident-management/all-incidents') &&
      response.status() === 200
    );

    // Find the row containing our description
    const incidentRow = page.locator('tr.mat-mdc-row', {
      has: page.locator('td.mat-mdc-cell', { hasText: description })
    });

    // Verify row is visible
    await expect(incidentRow).toBeVisible({ timeout: 15000 });

    // Verify incident details in the list
    await expect(incidentRow.locator('td', { hasText: 'Company Three' })).toBeVisible();
    await expect(incidentRow.locator('td', { hasText: 'Abierto' })).toBeVisible();
    await expect(incidentRow.locator('td', { hasText: 'Llamada' })).toBeVisible();

    // Store incident ID for later verification
    const incidentId = await incidentRow.locator('td').first().textContent();

    // 9. Click on the incident to view details
    await incidentRow.click();
    await expect(page).toHaveURL(new RegExp(`.*incident/${incidentId?.trim()}`));

    // 10. Verify incident details match creation data
    await expect(page.getByText(`Nombre: ${TEST_DATA.incident.firstName} ${TEST_DATA.incident.lastName}`)).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
    await expect(page.getByText('Estado: Abierto')).toBeVisible();
  });

  test('should show no companies available for invalid user', async ({ page }) => {
    // 1. Login
    await loginPage.goto();
    await loginPage.login(TEST_DATA.login.email, TEST_DATA.login.password);

    // Wait for successful login and dashboard to load
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Navigate to Create Incident
    await page.locator('mat-list-item', { hasText: 'Crear Nuevo Incidente' }).click();
    await expect(page).toHaveURL(/.*incident\/create/);

    // 3. Fill form with invalid data
    await page.getByLabel('Número de identificación del usuario').fill('INVALID123');
    await page.getByLabel('Tipo de documento').click();
    await page.getByRole('option', { name: 'cc' }).click();

    // 4. Wait for the companies response and verify no companies are available
    page.on('response', response => {
      if (response.status() === 404) {
        // Ignore 404 responses to prevent error logs
        return;
      }
    });

    const responsePromise = page.waitForResponse(
      response => response.url().includes('/user-management/user/companies'),
      { timeout: 30000 }
    );

    // 5. Wait for and verify 404 response
    const response = await responsePromise;
    expect(response.status()).toBe(404);
  });
});

test.describe('Incident Help Features', () => {
  let loginPage: LoginPage;
  let incidentCreatePage: IncidentCreatePage;
  let incidentDetailPage: IncidentDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    incidentCreatePage = new IncidentCreatePage(page);
    incidentDetailPage = new IncidentDetailPage(page);

    // Common setup: Login and navigate to incident creation
    await loginPage.goto();
    await loginPage.login(TEST_DATA.login.email, TEST_DATA.login.password);
    await expect(page).toHaveURL(/.*dashboard/);
    
    await page.locator('mat-list-item', { hasText: 'Crear Nuevo Incidente' }).click();
    await expect(page).toHaveURL(/.*incident\/create/);
    
    await incidentCreatePage.fillIncidentCreate(
      TEST_DATA.incident.documentId,
      TEST_DATA.incident.documentType,
      TEST_DATA.incident.company
    );
    
    await expect(page).toHaveURL(/.*incident\/details/);
  });

  test('should show similar incidents when description is provided', async ({ page }) => {
    // Fill in description first
    const description = faker.lorem.sentence().substring(0, 100);
    await page.fill('input[formControlName="description"]', description);

    // Click the similar incidents button
    await page.getByRole('button', { name: 'BUSCAR PROBLEMAS SIMILARES' }).click();

    // Verify suggestions appear in the readonly textarea
    const suggestionsTextarea = page.locator('textarea').first();
    await expect(suggestionsTextarea).not.toBeEmpty();
    
    // Verify the suggestions contain bullet points
    const suggestions = await suggestionsTextarea.inputValue();
    expect(suggestions).toContain('- ');
  });

  test('should show AI response when description is provided', async ({ page }) => {
    // Fill in description
    const description = faker.lorem.sentence().substring(0, 100);
    await page.fill('input[formControlName="description"]', description);

    // Click the AI response button
    await page.getByRole('button', { name: 'GENERAR POSIBLES RESPUESTAS' }).click();

    // Wait for and verify AI response
    const responseTextarea = page.locator('textarea').nth(1);
    await expect(responseTextarea).not.toBeEmpty();
  });

  test('should show warnings when buttons are clicked without description', async ({ page }) => {
    // Clear description field if it has any value
    await page.fill('input[formControlName="description"]', '');

    // Test similar incidents button
    await page.getByRole('button', { name: 'BUSCAR PROBLEMAS SIMILARES' }).click();
    await expect(page.getByText('La descripción del incidente es requerida')).toBeVisible();
    await expect(page.getByText('Error en el formulario')).toBeVisible();

    // Test AI response button
    await page.getByRole('button', { name: 'GENERAR POSIBLES RESPUESTAS' }).click();
    await expect(page.getByText('La descripción del incidente es requerida')).toBeVisible();
    await expect(page.getByText('Error en el formulario')).toBeVisible();

    // Verify textareas remain empty
    await expect(page.locator('textarea').first()).toBeEmpty();
    await expect(page.locator('textarea').nth(1)).toBeEmpty();
  });
});