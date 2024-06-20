import { test, Page, expect } from '@playwright/test';
import { General } from '../../pages/general';
import { Transactions } from '../../pages/transactions';

let page: Page;
let transactions: Transactions;

const users = require('../../support/users.json');
const transactionList = require('../../support/transactions.json');
const alerts = require('../../support/alerts.json');

test.describe('New Transaction', async () => {
    test.beforeEach(async ({ browser }) => {
        await General.seedDb();
        page = await browser.newPage();
        transactions = new Transactions(page);
        await transactions.goto();
        await transactions.clickNew();
    });
    test('can be added with Request action', async () => {
        await transactions.selectUser(users.userArely);
        await transactions.typeAmount(transactionList.newTransactionRequest.amount);
        await transactions.typeNote(transactionList.newTransactionRequest.note);
        await transactions.clickRequestButton();

        await expect(await transactions.getAlert()).toContain(alerts.addedTransaction);
        await expect(await transactions.getCompleteForm()).toContain(
            transactionList.newTransactionRequest.to
        );
        await expect(await transactions.getCompleteForm()).toContain(
            `Requested ${transactionList.newTransactionRequest.amount} for ${transactionList.newTransactionRequest.note}`
        );
    });
    test('searches for a user in Select Contact section', async () => {
        await transactions.typeContactSearch(`${users.userArely.name} ${users.userArely.lastname}`);

        await expect(await transactions.getUsersList()).toContain(
            `${users.userArely.name} ${users.userArely.lastname}`
        );
        await expect(await transactions.getUsersList()).toContain(`U: ${users.userArely.username}`);
        await expect(await transactions.getUsersList()).toContain(`E: ${users.userArely.email}`);
        await expect(await transactions.getUsersList()).toContain(`P: ${users.userArely.phone}`);
    });
    test('validates Payment section form', async () => {
        await transactions.selectUser(users.userArely);
        await transactions.typeAmount('');
        await transactions.typeNote('');
        await transactions.typeAmount('');

        await expect(await transactions.getPaymentForm()).toContain(alerts.emptyPaymentAmount);
        await expect(await transactions.getPaymentForm()).toContain(alerts.emptyPaymentNote);
        await expect(await transactions.getRequestButton()).toBeDisabled();
        await expect(await transactions.getPayButton()).toBeDisabled();
    });
    test('can be added with Pay action', async () => {
        await transactions.selectUser(users.userIbrahim);
        await transactions.typeAmount(transactionList.newTransactionPay.amount);
        await transactions.typeNote(transactionList.newTransactionPay.note);
        await transactions.clickPayButton();

        await expect(await transactions.getAlert()).toContain(alerts.addedTransaction);
        await expect(await transactions.getCompleteForm()).toContain(
            transactionList.newTransactionPay.to
        );
        await expect(await transactions.getCompleteForm()).toContain(
            `Paid ${transactionList.newTransactionPay.amount} for ${transactionList.newTransactionPay.note}`
        );
    });
    test.skip('can be added multiple times in a row', async () => {
        await transactions.selectUser(users.userKaylin);
        await transactions.typeAmount(transactionList.newTransactionMultiple.amount);
        await transactions.typeNote(transactionList.newTransactionMultiple.note);
        await transactions.clickRequestButton();
        await transactions.clickCreateAnother();
        await transactions.selectUser(users.userKaylin);
        await transactions.typeAmount(transactionList.newTransactionMultiple2.amount);
        await transactions.typeNote(transactionList.newTransactionMultiple2.note);
        await transactions.clickRequestButton();
        await transactions.clickReturn();

        //This functionality doesn't work in App, so test will fail
        await expect(
            await transactions.getTransaction(transactionList.newTransactionMultiple.amount)
        ).toBeVisible();
        await expect(
            await transactions.getTransaction(transactionList.newTransactionMultiple2.amount)
        ).toBeVisible();
    });
    test('should change users Account Balance', async () => {
        await transactions.selectUser(users.userKaylin);
        await transactions.typeAmount(transactionList.accountBalance.amount);
        await transactions.typeNote(transactionList.accountBalance.note);
        await transactions.clickPayButton();
        
        await expect(await transactions.getAlert()).toContain(alerts.addedTransaction);
        await expect(await transactions.getAccountBalance()).toHaveText(
            transactionList.accountBalance.balanceAfter
        );
    });
});
