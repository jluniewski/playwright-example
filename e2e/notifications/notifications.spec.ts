import { test, expect, Locator, Page } from '@playwright/test';
import { General } from '../../pages/general';
import { Notifications } from '../../pages/notifications';

const users = require('../../support/users.json');
const alerts = require('../../support/alerts.json');
const notificationsList = require('../../support/notifications.json');

let page: Page;
let notifications: Notifications;

test.describe('Notifications page', async () => {
    test.beforeEach(async ({ browser }) => {
        await General.seedDb();
        page = await browser.newPage();
        notifications = new Notifications(page);
        await page.goto('/notifications');
        await page.waitForSelector('main');
    });
    test('shows all notifications on the list', async () => {
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[0]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[1]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[2]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[3]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[4]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[5]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[6]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[7]
        );
    });
    test('can be opened from bell icon', async () => {
        await notifications.clickBellIcon();

        await expect(await notifications.getBellIcon()).toContainText(
            notificationsList.list.length.toString()
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[0]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[1]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[2]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[3]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[4]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[5]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[6]
        );
        await expect(await notifications.getAllNotifications()).toContain(
            notificationsList.list[7]
        );
    });
    test('allows to dismiss a notification', async () => {
        await notifications.dismiss(notificationsList.list[0]);

        await expect(await notifications.getAllNotifications()).not.toContain(
            notificationsList.list[0]
        );
    });
    test('shows message for no notifications', async () => {
        await notifications.dismissAll();

        await expect(await notifications.getMain()).toContainText(alerts.noNotifications);
    });
});
