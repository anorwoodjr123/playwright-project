const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Selectors using Playwright's semantic selectors (verified against actual DOM)
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByText('Invalid username or password');
    this.pageTitle = page.getByText('Project Board Login');
    this.loginForm = page.locator('form.space-y-6');
  }

  // Navigation methods
  async goto() {
    // Using relative URL thanks to baseURL in playwright.config.js
    await this.page.goto('/');
  }

  // Form interaction methods
  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  // Combined login action (like Cypress custom commands)
  async login(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  // Verification methods
  async verifyLoginPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.loginForm).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async verifyLoginPageElements() {
    // Verify all login page elements are visible and properly displayed
    await expect(this.pageTitle).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async verifyErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
  }

  async navigateAndVerifyLoginPage() {
    await this.goto();
    await this.verifyLoginPageLoaded();
    await this.verifyLoginPageElements();
  }

  async verifySuccessfulLogin() {
    // Should redirect to dashboard (no login form visible)
    await expect(this.usernameInput).not.toBeVisible();
    await expect(this.pageTitle).not.toBeVisible();
    // Verify dashboard elements appear (since URL doesn't change)
    await expect(this.page.getByText('Projects')).toBeVisible();
  }
}

module.exports = LoginPage;
