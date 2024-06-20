import { Page } from '@playwright/test';

export class Accounts {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/bankaccounts');
        await this.page.waitForSelector('header');
    }

    async getBankAccounts() {
        return this.page.locator('ul[data-test="bankaccount-list"]').textContent();
    }
    async clickCreateButton() {
        await this.page.getByRole('button', { name: 'Create' }).click();
    }
    async fillBankName(bankName) {
        await this.page.locator('#bankaccount-bankName-input').fill(bankName);
    }
    async fillRoutingNumber(routingNumber) {
        await this.page.locator('#bankaccount-routingNumber-input').fill(routingNumber);
    }
    async fillAccountNumber(accountNumber) {
        await this.page.locator('#bankaccount-accountNumber-input').fill(accountNumber);
    }
    async getSaveButton() {
        return this.page.getByTestId('bankaccount-submit');
    }
    async clickSaveButton() {
        await (await this.getSaveButton()).click();
    }
    async deleteAccount(accountName) {
        await this.page
            .locator('li[data-test*="bankaccount-list-item"]', {
                has: this.page.getByText(accountName),
            })
            .getByRole('button', { name: 'Delete' })
            .click();
    }
    async getAccount(accountName) {
        return this.page.locator('li[data-test*="bankaccount-list-item"]', {
            has: this.page.getByText(accountName),
        }).waitFor();
    }
    async gotoCreate() {
        await this.page.goto('/bankaccounts/new');
    }
    async getBankAccountForm() {
        return this.page.getByTestId('bankaccount-form').textContent();
    }
}
