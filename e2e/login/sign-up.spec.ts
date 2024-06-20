import { test, expect, Locator, Page } from '@playwright/test';
import { Login } from '../../pages/login';
import { General } from '../../pages/general';

const users = require('../../support/users.json');
const alerts = require('../../support/alerts.json');

let page: Page;
let login: Login;

let shortPassword = 'abc';
let incorrectPassword = 'test';

test.beforeEach(async ({ browser }) => {
    await General.seedDb();
    page = await browser.newPage();
    login = await new Login(page);
    await page.goto('/signup');
});

test.describe('Sign Up form', async () => {
    test('allows user to create new account', async () => {
        await login.typeFirstName(users.newUser.name);
        await login.typeLastName(users.newUser.password);
        await login.typeUsername(users.newUser.username);
        await login.typeSignUpPassword(users.newUser.password);
        await login.typeConfirmPassword(users.newUser.password);
        await login.clickSignUpButton();

        await expect(login.getSignInHeader()).toBeVisible();
    });
    test('validates empty inputs', async () => {
        await login.typeFirstName('');
        await login.typeLastName('');
        await login.typeUsername('');
        await login.typeSignUpPassword('');
        await login.typeConfirmPassword('');
        await login.clickMain();

        await expect(login.getValidations().nth(0)).toHaveText(alerts.emptyFirstName);
        await expect(login.getValidations().nth(1)).toHaveText(alerts.emptyLastName);
        await expect(login.getValidations().nth(2)).toHaveText(alerts.emptySignUpUsername);
        await expect(login.getValidations().nth(3)).toHaveText(alerts.emptySignUpPassword);
        await expect(login.getValidations().nth(4)).toHaveText(alerts.emptyConfirmPassword);
    });
    test('validates short password', async () => {
        await login.typeSignUpPassword(shortPassword);

        await expect(login.getValidations().nth(1)).toHaveText(alerts.signUpShortPassword);
    });
    test('validates not matching passwords', async () => {
        await login.typeSignUpPassword(incorrectPassword);
        await login.typeConfirmPassword(shortPassword);

        await expect(login.getValidations().nth(1)).toHaveText(alerts.passwordsDontMatch);
    });
});
