import { test, expect, Locator, Page } from '@playwright/test';
import { Login } from '../../pages/login';
import { General } from '../../pages/general';

const users = require('../../support/users.json');

let page: Page;
let login: Login;

test.beforeEach(async ({ browser }) => {
    await General.seedDb();
    page = await browser.newPage();
    login = new Login(page);
    await page.goto('/');
});

test.describe('Remember Me option', async () => {
    test.skip('remembers username and password', async () => {
        await login.typeUsername(users.userEdgar.username);
        await login.typePassword(users.userEdgar.password);
        await login.clickSignIn();
        await login.logout();

        //this test will fail, app doesn't have this functionality
        await expect(login.getUsername()).toHaveValue(users.userEdgar.username);
        await expect(login.getPassword()).toHaveValue(users.userEdgar.password);
    })
})