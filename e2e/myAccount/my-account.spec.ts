import { test, expect, Locator, Page } from '@playwright/test';
import { General } from '../../pages/general';
import { MyAccount } from '../../pages/myAccount';

const users = require('../../support/users.json');
const alerts = require('../../support/alerts.json');

let page: Page;
let myAccount: MyAccount;

let invalidEmail = 'testEmail';
let invalidPhone = '123';

test.beforeEach(async ({ browser }) => {
    await General.seedDb();
    page = await browser.newPage();
    myAccount = new MyAccount(page);
    await myAccount.goto();
});

test.describe('My Account page', async () => {
    test('shows user settings', async () => {
        await expect(await myAccount.getFirstName()).toHaveValue(users.userEdgar.name);
        await expect(await myAccount.getLastName()).toHaveValue(users.userEdgar.lastname);
        await expect(await myAccount.getEmail()).toHaveValue(users.userEdgar.email);
        await expect(await myAccount.getPhone()).toHaveValue(users.userEdgar.phone);
    })
    test('allows user to edit settings', async () => {
        await myAccount.typeFirstName(users.newUser.name);
        await myAccount.typeLastName(users.newUser.lastname);
        await myAccount.typeEmail(users.newUser.email);
        await myAccount.typePhone(users.newUser.phone);
        await myAccount.clickSaveButton();
        await myAccount.reloadPage();

        await expect(await myAccount.getFirstName()).toHaveValue(users.newUser.name);
        await expect(await myAccount.getLastName()).toHaveValue(users.newUser.lastname);
        await expect(await myAccount.getEmail()).toHaveValue(users.newUser.email);
        await expect(await myAccount.getPhone()).toHaveValue(users.newUser.phone);
    })
    test('validates empty user settings form', async () => {
        await myAccount.typeFirstName('');
        await myAccount.typeLastName('');
        await myAccount.typeEmail('');
        await myAccount.typePhone('');

        await expect(await myAccount.getSettingsForm()).toContain(alerts.emptySettingsFirstName);
        await expect(await myAccount.getSettingsForm()).toContain(alerts.emptySettingsLastName);
        await expect(await myAccount.getSettingsForm()).toContain(alerts.emptySettingsEmail);
        await expect(await myAccount.getSettingsForm()).toContain(alerts.emptySettingsPhone);
    })
    test('validates incorrect email and phone number', async () => {
        await myAccount.typeEmail(invalidEmail);
        await myAccount.typePhone(invalidPhone);

        await expect(await myAccount.getSettingsForm()).toContain(alerts.invalidSettingsEmail);
        await expect(await myAccount.getSettingsForm()).toContain(alerts.invalidSettingsPhone);
    })
})