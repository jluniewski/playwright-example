import { test, Page, expect } from '@playwright/test';
import { General } from '../../pages/general';
import { Transactions } from '../../pages/transactions';

const users = require('../../support/users.json');
const transactionList = require('../../support/transactions.json');

let page: Page;
let transactions: Transactions;

test.describe('Transaction Details', async () => {
    test.beforeEach(async ({ browser }) => {
        await General.seedDb();
        page = await browser.newPage();
        transactions = new Transactions(page);
        await transactions.goto();
        await transactions.openTransaction(transactionList.everyoneComment.amount);
    });
    test('allow user to see all all information about transaction', async () => {
        await expect((await transactions.getDetailsAvatars()).nth(0)).toHaveAttribute(
            'src',
            users.userEdgar.avatar
        );
        await expect((await transactions.getDetailsAvatars()).nth(1)).toHaveAttribute(
            'src',
            users.userIbrahim.avatar
        );
        await expect(await transactions.getTransactionDetailsText()).toContain(
            `${users.userEdgar.name} ${users.userEdgar.lastname}`
        );
        await expect(await transactions.getTransactionDetailsText()).toContain(
            `${users.userIbrahim.name} ${users.userIbrahim.lastname}`
        );
        await expect(await transactions.getTransactionDetailsText()).toContain(
            transactionList.everyoneComment.amount
        );
        await expect(await transactions.getTransactionDetailsText()).toContain(
            transactionList.everyoneComment.likes.toString()
        );
        await expect(await transactions.getTransactionDetailsText()).toContain(
            transactionList.everyoneComment.comments.comm_1.text
        );
    });
    test('allow user to like a transaction', async () => {
        await transactions.clickLikeButton();

        await expect(await transactions.getLikesCount()).toHaveText(
            (transactionList.everyoneComment.likes + 1).toString()
        );
        await expect(await transactions.getLikeButton()).toBeDisabled();
    });
    test('allow user to add a comment', async () => {
        await transactions.addComment(transactionList.newComment.comments.comm_1);

        await expect(await transactions.getTransactionDetailsText()).toContain(
            transactionList.newComment.comments.comm_1
        );
    });
});
