import { test, expect, Locator, Page } from '@playwright/test';

export class Login {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
    async goto() {
        await this.page.goto('/');
    }
    async typeUsername(username) {
        await this.getUsername().type(username);
    }
    async clearUsername() {
        await this.getUsername().clear();
    }
    async typePassword(password) {
        await this.getPassword().type(password);
    }
    getPassword() {
        return this.page.getByLabel('Password');
    }
    getPasswordValidation() {
        return this.page.locator('#password-helper-text');
    }
    async checkRememberMe() {
        await this.page.getByRole('checkbox', { name: 'remember' }).click();
    }
    async clickSignIn() {
        await this.getSignInButton().click();
    }
    getSidenavUsername() {
        return this.page.getByTestId('sidenav-username'); 
    }
    getUsername() {
        return this.page.getByLabel('Username');
    }
    getUsernameValidation() {
        return this.page.locator('#username-helper-text');
    }
    getSignInButton() {
        return this.page.getByTestId('signin-submit');
    }
    async clickMain() {
        await this.page.getByRole('main').click();
    }
    getSignInAlert() {
        return this.page.getByTestId('signin-error');
    }
    getSignUpLink() {
        return this.page.getByTestId('signup')
    }
    async clickSignUpLink() {
        await expect(this.getSignUpLink()).toBeVisible;
        await this.getSignUpLink().click();
    }
    getSignUpTitle() {
        return this.page.getByTestId('signup-title');
    }
    async logout() {
        await this.page.getByTestId('sidenav-signout').click();
    }
    getFirstName() {
        return this.page.getByLabel('First Name');
    }
    getLastName() {
        return this.page.getByLabel('Last Name');
    }
    getSignUpPassword() {
        return this.page.locator('#password');
    }
    getConfirmPassword() {
        return this.page.getByLabel('Confirm Password');
    }
    async typeFirstName(firstName) {
        await this.getFirstName().type(firstName);
    }
    async typeLastName(lastName) {
        await this.getLastName().type(lastName);
    }
    async typeSignUpPassword(password) {
        await this.getSignUpPassword().type(password);
    }
    async typeConfirmPassword(password) {
        await this.getConfirmPassword().type(password);
    }
    getSignUpButton() {
        return this.page.getByTestId('signup-submit');
    }
    async clickSignUpButton() {
        await this.getSignUpButton().click();
    }
    async clickSignInLink() {
        await this.page.locator('a[href="/signin"]').click();
    }
    getValidations() {
        return this.page.locator('[id*="helper-text"]');
    }
    getSignInHeader() {
        return this.page.getByRole('heading', { name: 'Sign in' });
    }
}