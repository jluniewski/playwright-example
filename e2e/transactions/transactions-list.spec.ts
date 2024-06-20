import { test, Page, expect } from '@playwright/test';
import { General } from '../../pages/general';
import { Transactions } from '../../pages/transactions';

const transactionList = require('../../support/transactions.json');

let page: Page;
let transactions: Transactions;

test.describe('Transaction List', async () => {
    test.beforeEach(async ({ browser }) => {
        await General.seedDb();
        page = await browser.newPage();
        transactions = new Transactions(page);
        await transactions.goto();
    });
    test('is showing everyones transactions', async () => {
        await expect(
            await transactions.getTransaction(transactionList.everyone.amount)
        ).toBeVisible();
    });
    test('is showing friends transactions', async () => {
        await transactions.selectTab('Friends');

        await expect(
            await transactions.getTransaction(transactionList.friends.amount)
        ).toBeVisible();
    });
    test('is showing mine transactions', async () => {
        await transactions.selectTab('Mine');

        await expect(
            await transactions.getTransaction(transactionList.personal.amount)
        ).toBeVisible();
    });
    test('filters transactions by Date', async () => {
        await transactions.selectDate('2020-04-13', '2020-04-15');

        await expect(
            await transactions.getTransaction(transactionList.everyone.amount)
        ).toBeVisible();
    });
    test('filters transactions by Amount', async () => {
        await transactions.selectAmount(35, 600);
        await transactions.clickMain();

        await expect(
            await transactions.getTransaction(transactionList.everyone.amount)
        ).toBeVisible();
    });
});
