import { test, Page, expect } from '@playwright/test';
import { Accounts } from '../../pages/bankAccounts';
import { General } from '../../pages/general';
import { executionAsyncResource } from 'async_hooks';

const users = require('../../support/users.json');
const alerts = require('../../support/alerts.json');
const accountsList = require('../../support/accounts.json');

let page: Page;
let accounts: Accounts;

let incorrectNumber = '123';

test.beforeEach(async ({ browser }) => {
    await General.seedDb();
    page = await browser.newPage();
    accounts = new Accounts(page);
    await accounts.goto();
});

test.describe('Bank Accounts page', async () => {
    test('shows list of accounts', async () => {
        await expect(await accounts.getBankAccounts()).toContain(accountsList.EdgarAccount.name);
    });
    test('allows user to create new account', async () => {
        await accounts.clickCreateButton();
        await accounts.fillBankName(accountsList.TestBankAccount.name);
        await accounts.fillRoutingNumber(accountsList.TestBankAccount.routingNumber);
        await accounts.fillAccountNumber(accountsList.TestBankAccount.accountNumber);
        await accounts.clickSaveButton();
        await accounts.getAccount(accountsList.TestBankAccount.name);

        await expect(await accounts.getBankAccounts()).toContain(accountsList.TestBankAccount.name);
    });
    test('allows user to delete existing account', async () => {
        await accounts.deleteAccount(accountsList.EdgarAccount.name);
        await accounts.getAccount(`${accountsList.EdgarAccount.name} (Deleted)`);

        await expect(await accounts.getBankAccounts()).toContain(`${accountsList.EdgarAccount.name} (Deleted)`);
    });
    test('validates empty inputs for Create Bank Account form', async () => {
        await accounts.gotoCreate();
        await accounts.fillBankName('');
        await accounts.fillRoutingNumber('');
        await accounts.fillAccountNumber('');
        await accounts.fillBankName('');

        await expect(await accounts.getBankAccountForm()).toContain(alerts.emptyBankName);
        await expect(await accounts.getBankAccountForm()).toContain(alerts.emptyRoutingNumber);
        await expect(await accounts.getBankAccountForm()).toContain(alerts.emptyAccountNumber);
        await expect(await accounts.getSaveButton()).toBeDisabled();
    });
    test('validates incorrect routing and account numbers', async () => {
        await accounts.gotoCreate();
        await accounts.fillRoutingNumber(incorrectNumber);
        await accounts.fillAccountNumber(incorrectNumber);

        await expect(await accounts.getBankAccountForm()).toContain(alerts.incorrectRoutingNumber);
        await expect(await accounts.getBankAccountForm()).toContain(alerts.incorrectAccountNumber);

    });
});
