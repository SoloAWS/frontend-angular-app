import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { SignupPage } from '../pages/signup.page';
import { PlanInitPage } from '../pages/plan-init.page';
import { PlanPayPage } from '../pages/plan-pay.page';
import { PlanSelectPage } from '../pages/plan-select.page';
import { LoginPage } from '../pages/login.page';

test.describe('Company Signup Flow', () => {
  let loginPage: LoginPage;
  let signupPage: SignupPage;
  let planInitPage: PlanInitPage;
  let planSelectPage: PlanSelectPage;
  let planPayPage: PlanPayPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
    planInitPage = new PlanInitPage(page);
    planSelectPage = new PlanSelectPage(page);
    planPayPage = new PlanPayPage(page);
  });

  test('successful company signup and plan subscription', async ({ page }) => {
    // Start signup process
    await signupPage.goto();
    let email = faker.internet.email();
    // Fill signup form with valid data
    await signupPage.fillSignupForm({
      companyName: 'Test Company',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      phoneNumber: '+57 123 456 7890',
      country: 'Colombia',
      city: 'Bogotá',
      email: email,
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#'
    });
    await signupPage.submit();
    await expect(page).toHaveURL(/.*plan\/init/);

    await loginPage.goto();
    await loginPage.login(email, "Test123!@#");
    await expect(page).toHaveURL(/.*dashboard/);

    // Click on select plan button
    await planInitPage.goto();
    await planInitPage.clickSelectPlan();
    await expect(page).toHaveURL(/.*plan\/select/);

    // Wait for plans to load and select one
    await planSelectPage.waitForPlansToLoad();
    await planSelectPage.selectPlan();
    await expect(page).toHaveURL(/.*plan\/pay/);

    // Fill payment form with valid data
    await planPayPage.fillPaymentForm({
      cardNumber: '4111 1111 1111 1111',
      expirationDate: '12/25',
      cvv: '123',
      cardHolderName: 'John Doe'
    });

    // Wait for success response when submitting payment
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/billing-manager/assign-plan') &&
      response.status() === 200
    );

    await planPayPage.submitPayment();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  test('invalid signup data', async ({ page }) => {
    await signupPage.goto();

    // Fill form with invalid data
    await signupPage.fillSignupForm({
      companyName: 'A', // Too short
      firstName: '',
      lastName: '',
      birthDate: '2010-01-01', // Underage
      phoneNumber: '123', // Invalid format
      country: 'Colombia',
      city: 'Bogotá',
      email: 'invalid-email', // Invalid format
      password: '12345678', // Weak password
      confirmPassword: '87654321' // Mismatched
    });

    await signupPage.submit();

    // Verify error messages
    await signupPage.waitForErrorMessage('Mínimo 2 caracteres');
    await signupPage.waitForErrorMessage('Debe ser mayor de 18 años');
    await signupPage.waitForErrorMessage('Ingrese formato (+XX XXX XXX XXXX)');
    await signupPage.waitForErrorMessage('Ingrese un correo electrónico válido');
    await signupPage.waitForErrorMessage('La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales');
    await signupPage.waitForErrorMessage('Las contraseñas no coinciden');
  });

  test('invalid payment data', async ({ page }) => {
    // Complete signup first
    await signupPage.goto();
    let email = faker.internet.email();
    await signupPage.fillSignupForm({
      companyName: 'Test Company',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
      phoneNumber: '+57 123 456 7890',
      country: 'Colombia',
      city: 'Bogotá',
      email: email,
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#'
    });
    await signupPage.submit();
    await expect(page).toHaveURL(/.*plan\/init/);

    await loginPage.goto();
    await loginPage.login(email, "Test123!@#");
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate through plan selection
    await planInitPage.goto();
    await planInitPage.clickSelectPlan();
    await planSelectPage.waitForPlansToLoad();
    await planSelectPage.selectPlan();

    // Fill payment form with invalid data
    await planPayPage.fillPaymentForm({
      cardNumber: '1234 5678', // Invalid card number
      expirationDate: '99/99', // Invalid date
      cvv: '12', // Invalid CVV
      cardHolderName: '123' // Invalid name
    });

    await planPayPage.submitPayment();

    // Verify error messages
    await expect(page.getByText('El número de tarjeta debe tener 16 dígitos')).toBeVisible();
    await expect(page.getByText('La fecha de expiración debe tener el formato MM/AA')).toBeVisible();
    await expect(page.getByText('El CVV debe tener 3 dígitos')).toBeVisible();
  });
});
