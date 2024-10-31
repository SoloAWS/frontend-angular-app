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
    const description = faker.lorem.sentence().substring(0, 100);
    await incidentDetailPage.fillIncidentDetails(
      TEST_DATA.incident.priority,
      description
    );

    // 6. Verify success toast and incident creation
    await expect(page.getByText('Request Successful')).toBeVisible();

    // Refresh and verify incident appears in history
    await page.reload();
    await expect(page.getByText(description)).toBeVisible();
  });

  test('should show no companies available for invalid user', async ({ page }) => {
    // 1. Login
    await loginPage.goto();
    await loginPage.login(TEST_DATA.login.email, TEST_DATA.login.password);

    // Wait for successful login and dashboard to load
    await expect(page).toHaveURL(/.*dashboard/);

    // Click menu icon to open sidebar
    await page.getByRole('button', { name: 'menu' }).click();

    // 2. Navigate to Create Incident
    await page.locator('mat-list-item', { hasText: 'Crear Nuevo Incidente' }).click();
    await expect(page).toHaveURL(/.*incident\/create/);

    // 3. Fill form with invalid data
    await page.getByLabel('Número de identificación del usuario').fill('INVALID123');
    await page.getByLabel('Tipo de documento').click();
    await page.getByRole('option', { name: 'cc' }).click();

    // 4. Wait for the companies response and verify no companies are available
    const companiesResponse = await page.waitForResponse(response =>
      response.url().includes('/user-management/user/companies') &&
      response.status() === 200
    );

    // Get the response data
    const responseData = await companiesResponse.json();

    // Verify the response has empty companies array
    expect(responseData.companies).toHaveLength(0);

    // Verify UI reflects no companies available
    const companySelect = page.getByLabel('Empresa');
    await expect(companySelect).toBeDisabled();

    // Verify Continue button is disabled
    const continueButton = page.getByRole('button', { name: 'CONTINUAR' });
    await expect(continueButton).toBeDisabled();
  });
});
