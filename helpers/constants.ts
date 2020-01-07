
import { browser } from 'protractor';
export class Constants {
    public static readonly URL = browser.baseUrl;
    public static readonly EMAIL = 'admin@gmail.com';
    public static readonly PASSWORD = 'admin123';
    public static readonly GLOBAL_TIMEOUT: number = 90;
    public static FLIGHT_DATA_SECTION = { "Airline": "1", "DepartFrom": "2", "Duration": "3", "DepartTo": "4", "Price": "5" };
    public static BooingCode: string;
    public static readonly FormatDate = 'EEE MMM dd yyyy';// ==> Mon Dec 23 2019
}