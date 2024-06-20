import { test, expect, Locator, Page } from '@playwright/test';

export class MyAccount {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async loginUsernamePassword(username, password) {
        await this.page.goto('/signin');
        await this.page.getByLabel('Username').type(username);
        await this.page.getByLabel('Password').type(password);
        await this.page.getByTestId('signin-submit').click();
        await this.page.waitForSelector('header');
        await this.page.goto('/user/settings');
        await this.page.waitForSelector('header');
    }
    async goto() {
        await this.page.goto('/user/settings');
        await this.page.waitForSelector('header');
    }
    async reloadPage() {
        await this.page.reload();
        await this.page.waitForSelector('header');
    }
    async visibleSettings() {
        await expect(await this.page.getByText('User Settings')).toBeVisible();
    }

    async getFirstName() {
        return await this.page.locator('[id="user-settings-firstName-input"]');
    }
    async typeFirstName(firstName) {
        await (await this.getFirstName()).fill(firstName);
    }
    async getLastName() {
        return await this.page.getByTestId('user-settings-lastName-input');
    }
    async typeLastName(lastName) {
        await (await this.getLastName()).fill(lastName);
    }
    async getEmail() {
        return await this.page.getByTestId('user-settings-email-input');
    }
    async typeEmail(email) {
        await (await this.getEmail()).fill(email);
    }
    async getPhone() {
        return await this.page.getByTestId('user-settings-phoneNumber-input');
    }
    async typePhone(phone) {
        await (await this.getPhone()).fill(phone);
    }
    async getSaveButton() {
        return await this.page.getByTestId('user-settings-submit');
    }
    async clickSaveButton() {
        await (await this.getSaveButton()).click();
    }
    async getSettingsForm() {
        return await this.page.getByTestId('user-settings-form').textContent();
    }

}