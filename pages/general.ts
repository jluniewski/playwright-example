import { Page } from '@playwright/test';
import axios from 'axios';

const testDataApiEndpoint = `${process.env.APIURL}/testData`;
export class General {
    static async seedDb() {
        // seed database with test data
        const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
        return data;
    }
}
