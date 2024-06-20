import { Page } from '@playwright/test';

export class Transactions {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/');
        await this.page.waitForSelector('header');
    }
    async clickNew() {
        await this.page.getByTestId('nav-top-new-transaction').click();
    }
    async selectTab(tabName) {
        var tabs = {
            Everyone: 'public',
            Friends: 'contacts',
            Mine: 'personal',
        };
        await this.page.getByTestId(`nav-${tabs[tabName]}-tab`).click();
    }
    async getTransaction(amount) {
        return this.page.locator('li[data-test*="transaction-item"]', {
            has: await this.page.getByText(amount),
        });
    }
    async selectDate(dateFrom, dateTo) {
        await this.page.getByTestId('transaction-list-filter-date-range-button').click();
        await this.page.locator('div[class="Cal__MonthList__root"]').focus();
        for (var i = 0; i < 100; i++) {
            await this.page.locator('ul[aria-label="Week 1"]').first().scrollIntoViewIfNeeded();
            if (await this.page.locator(`li[data-date="${dateFrom}"]`).isVisible()) {
                await this.page.locator(`li[data-date="${dateFrom}"]`).click({ force: true });
                await this.page.locator(`li[data-date="${dateTo}"]`).click({ force: true });
                return;
            }
        }
        await this.page.locator(`[data-date="${dateFrom}"]`).click();
        await this.page.locator(`[data-date="${dateTo}"]`).click();
    }
    async selectAmount(min, max) {
        await this.page.getByTestId('transaction-list-filter-amount-range-button').click();
        await this.page
            .getByTestId('transaction-list-filter-amount-range-slider')
            .click({ position: { x: min / 5, y: 0 } });
        await this.page
            .getByTestId('transaction-list-filter-amount-range-slider')
            .click({ position: { x: max / 5, y: 0 } });
    }
    async clickMain() {
        await this.page.locator('#amount-range-popover').click();
    }
    async openTransaction(amount) {
        await (await this.getTransaction(amount)).click();
    }
    async getTransactionDetails() {
        return this.page
            .locator('div', { has: this.page.getByTestId('transaction-detail-header') })
            .last();
    }
    async getTransactionDetailsText() {
        return (await this.getTransactionDetails()).textContent();
    }
    async getDetailsAvatars() {
        return (await this.getTransactionDetails()).locator('img[class="MuiAvatar-img"]');
    }
    async getLikeButton() {
        return this.page.locator('button[data-test*="transaction-like-button"]');
    }
    async clickLikeButton() {
        await (await this.getLikeButton()).click();
    }
    async getLikesCount() {
        return this.page.locator('div[data-test*="transaction-like-count"]');
    }
    async addComment(comment) {
        await this.page.locator('input[id*="transaction-comment-input"]').fill(comment);
        await this.page.keyboard.press('Enter');
    }
    async selectUser(user) {
        await this.page
            .locator('li[data-test*="user-list-item"]', {
                has: this.page.getByText(`${user.name} ${user.lastname}`),
            })
            .click();
    }
    async typeAmount(amount) {
        await this.page.locator('#amount').fill(amount);
    }
    async typeNote(note) {
        await this.page.locator('#transaction-create-description-input').fill(note);
    }
    async getRequestButton() {
        return this.page.getByTestId('transaction-create-submit-request');
    }
    async getPayButton() {
        return this.page.getByTestId('transaction-create-submit-payment');
    }
    async clickRequestButton() {
        await (await this.getRequestButton()).click();
    }
    async clickPayButton() {
        await (await this.getPayButton()).click();
    }
    async getAlert() {
        return this.page.getByTestId('alert-bar-success').textContent();
    }
    async getCompleteForm() {
        return this.page
            .getByRole('main')
            .locator('div[class*="MuiContainer-root"]', {
                has: this.page.getByTestId('new-transaction-return-to-transactions'),
            })
            .textContent();
    }
    async typeContactSearch(user) {
        await this.page.getByTestId('user-list-search-input').fill(user);
    }
    async getUsersList() {
        return this.page.getByTestId('users-list').textContent();
    }
    async getPaymentForm() {
        return this.page.getByTestId('transaction-create-form').textContent();
    }
    async clickCreateAnother() {
        await this.page.getByTestId('new-transaction-create-another-transaction').click();
    }
    async clickReturn() {
        await this.page.getByTestId('new-transaction-return-to-transactions').click();
    }
    async getAccountBalance() {
        return this.page.getByTestId('sidenav-user-balance');
    }
}
