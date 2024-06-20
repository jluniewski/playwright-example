import { Page } from '@playwright/test';

export class Notifications {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getNotification(notification) {
        return this.page
            .locator('li[data-test*="notification-list-item"]', {
                has: this.page.getByText(notification),
            })
            .first();
    }
    async dismiss(notification) {
        var selectedNotification = await (
            await this.getNotification(notification)
        ).getByRole('button', { name: 'Dismiss' });
        await selectedNotification.click();
        await selectedNotification.waitFor({ state: 'detached' });
    }
    async dismissAll() {
        // only this solution clicks all buttons
        await this.page.getByTestId('notification-mark-read-9m-W-uI5fQUF').click();
        await this.page.getByTestId('notification-mark-read-tk8jNBQURvQz').click();
        await this.page.getByTestId('notification-mark-read-95qRwfJnSORQ').click();
        await this.page.getByTestId('notification-mark-read-Fq8xLCRtpWhT').click();
        await this.page.getByTestId('notification-mark-read-88Nrddj3XCir').click();
        await this.page.getByTestId('notification-mark-read-Bf5th29A1FHa').click();
        await this.page.getByTestId('notification-mark-read-kpQnRR8__imz').click();
        await this.page.getByTestId('notification-mark-read-ojTwLrF1tDvQ').click();
        // this should work, but not all buttons are clicked
        //var allNotifications = await this.page
        //    .getByTestId('notifications-list')
        //    .getByRole('button', { name: 'Dismiss' })
        //    .all();
        //await allNotifications.forEach(async (dismissButton) => {
        //    await dismissButton.click();
        //    await dismissButton.waitFor({state: 'detached'});
        //});
    }

    async getAllNotifications() {
        return this.page.getByTestId('notifications-list').textContent();
    }

    async getBellIcon() {
        return this.page.getByTestId('nav-top-notifications-link');
    }

    async clickBellIcon() {
        await (await this.getBellIcon()).click();
    }

    async getMain() {
        return this.page.getByRole('main');
    }
}
