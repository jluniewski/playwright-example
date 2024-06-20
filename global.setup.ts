import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from './playwright.config';
import { join } from 'path';
const users = require('./support/users.json');

setup('Login via API', async ({ page }) => {
    await page.goto('/');
    let response = await page.request.post(`${process.env.APIURL}/login`, {
        data: {
            type: 'LOGIN',
            username: users.userEdgar.username,
            password: users.userEdgar.password,
        },
    });
    let authState = await JSON.stringify({
        actions: [
            {
                type: 'xstate.stop',
                activity: {
                    src: { type: 'performLogin' },
                    id: 'authentication.loading:invocation[0]',
                    type: 'xstate.invoke',
                },
            },
            { type: 'redirectHomeAfterLogin' },
        ],
        activities: {
            'authentication.loading:invocation[0]': false,
            'authentication.updating:invocation[0]': false,
            'authentication.refreshing:invocation[0]': false,
            'authentication.logout:invocation[0]': false,
        },
        meta: {},
        events: [],
        value: 'authorized',
        context: await response.json(),
        _event: {
            name: 'done.invoke.authentication.loading:invocation[0]',
            data: {
                type: 'done.invoke.authentication.loading:invocation[0]',
                data: await response.json(),
            },
            $$type: 'scxml',
            type: 'external',
            origin: 'authentication.loading:invocation[0]',
        },
        _sessionid: 'x:0',
        event: {
            type: 'done.invoke.authentication.loading:invocation[0]',
            data: await response.json(),
        },
        historyValue: { current: 'authorized', states: {} },
        history: {
            actions: [
                {
                    type: 'xstate.start',
                    activity: {
                        src: { type: 'performLogin' },
                        id: 'authentication.loading:invocation[0]',
                        type: 'xstate.invoke',
                    },
                },
            ],
            activities: {
                'authentication.loading:invocation[0]': {
                    type: 'xstate.start',
                    activity: {
                        src: { type: 'performLogin' },
                        id: 'authentication.loading:invocation[0]',
                        type: 'xstate.invoke',
                    },
                },
                'authentication.updating:invocation[0]': false,
                'authentication.refreshing:invocation[0]': false,
                'authentication.logout:invocation[0]': false,
            },
            meta: {},
            events: [],
            value: 'loading',
            context: { message: 'Request failed with status code 500' },
            _event: {
                name: 'LOGIN',
                data: {
                    type: 'LOGIN',
                    username: users.userEdgar.username,
                    password: users.userEdgar.password,
                },
                $$type: 'scxml',
                type: 'external',
            },
            _sessionid: 'x:0',
            event: {
                type: 'LOGIN',
                username: users.userEdgar.username,
                password: users.userEdgar.password,
            },
            historyValue: { current: 'loading', states: {} },
            children: {},
            done: false,
            changed: true,
            tags: [],
        },
        children: {},
        done: false,
        changed: true,
        tags: [],
    });
    await page.evaluate(async (authState) => {
        window.localStorage.setItem('authState', authState);
    }, authState);
    await page.context().storageState({ path: STORAGE_STATE });
});
