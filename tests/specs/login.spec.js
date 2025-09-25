const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const credentials = require('../data/credentials.json');
const { login } = require('../utils/helpers');

test.describe('Login Functionality', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    // Navigate to login page and verify all elements are loaded and visible
    await loginPage.navigateAndVerifyLoginPage();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Use login helper function
    await login(loginPage);
    
    // Verify successful login (should redirect to dashboard)
    await loginPage.verifySuccessfulLogin();
    
  });

  test.describe('Invalid Login Attempts', () => {
    // Data-driven test for invalid credentials
    credentials.invalidCredentials.forEach((invalidCred, index) => {
      test(`should show error message for invalid credentials ${index + 1}`, async () => {
        await loginPage.login(invalidCred.email, invalidCred.password);
        
        // Verify error message is displayed
        await loginPage.verifyErrorMessage();
        
        // Verify we're still on login page
        await expect(loginPage.usernameInput).toBeVisible();
      });
    });
  });
});
