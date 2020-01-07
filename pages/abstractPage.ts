import { Common } from '../helpers/common';
import { AbstractPageUI } from '../interfaces/abstractPage.ui';
import { browser, promise, element, ElementFinder, ElementArrayFinder } from 'protractor';
import { isNullOrUndefined } from 'util';
export class AbstractPageObject extends Common {
    constructor() {
        super();
    }

    async openDynamicPageByUrl(url: string) {
        return await this.openURL(url);
    }

    async waitForAllWebixControlsReady() {
        return await this.isControlPresent(AbstractPageUI.ALL_CONTROL);
    }

    async getColumnNumberFromFixedHeader(dataTableID: string, headerName: string) {
        await this.waitForAllWebixControlsReady();
        await this.waitForDynamicControlPresence(AbstractPageUI.DYNAMIC_DATATABLE_FIXED_HEADER_COLUMN, dataTableID, headerName);
        await this.waitForDynamicControlVisible(AbstractPageUI.DYNAMIC_DATATABLE_FIXED_HEADER_COLUMN, dataTableID, headerName);
        return await this.getDynamicAttributeValue(AbstractPageUI.DYNAMIC_DATATABLE_FIXED_HEADER_COLUMN, "column", dataTableID, headerName);
    }

    async isDynamicCellValueExist(dataTableId: string, cellValue: string, rowTmp: string, colTmp: string) {
        await this.waitForAllWebixControlsReady();
        return await this.isDynamicControlDisplayed(AbstractPageUI.DYNAMIC_CELL_VALUE_WITH_ROW_COLUMN, dataTableId, rowTmp, colTmp, cellValue);
    }

    async dynamicPageOrSectionIsDisplayed(pageTagName: string) {
        await this.waitForDynamicControlVisible(AbstractPageUI.DYNAMIC_PAGE_OR_SECTION_DISPLAYED, pageTagName);
        return await this.isDynamicControlDisplayed(AbstractPageUI.DYNAMIC_PAGE_OR_SECTION_DISPLAYED, pageTagName);
    }

    async dynamicSectionIsDisplayed(sectionName: string) {
        await this.waitForDynamicControlVisible(AbstractPageUI.DYNAMIC_TEXT_FIELD, sectionName);
        return await this.isDynamicControlDisplayed(AbstractPageUI.DYNAMIC_TEXT_FIELD, sectionName);
    }


    async clickDynamicButton(buttonName: string) {
        await this.waitForDynamicControlClickAble(AbstractPageUI.DYNAMIC_BTN, buttonName);
        await this.clickToDynamicElement(AbstractPageUI.DYNAMIC_BTN, buttonName);
        return await browser.sleep(2000);
    }
    async clickDynamicFlightBookingButton(number: string) {
        await this.waitForDynamicControlClickAble(AbstractPageUI.DYNAMIC_FLIGHT_NUMBER_BOOKING_BUTTON, number);
        await this.clickToDynamicElement(AbstractPageUI.DYNAMIC_FLIGHT_NUMBER_BOOKING_BUTTON, number);
        return await browser.sleep(2000);
    }
    async inputToDynamicTextbox(viewIDName: string, value: string) {
        await this.sendKeyToDynamicElement(AbstractPageUI.DYNAMIC_TEXTBOX, value, viewIDName);
        return await this.pressTabToDynamicTextbox(AbstractPageUI.DYNAMIC_TEXTBOX, viewIDName);
    }

    async inputToSearchTextbox(viewIDName: string, value: string) {
        await this.sendKeyToDynamicElement(AbstractPageUI.DYNAMIC_TEXTBOX, value, viewIDName);
        return await this.pressEnterButton();
    }

    async inputToDynamicDateTimeTextbox(viewIDName: string, value: string) {
        await this.sendValueToDynamicElement(AbstractPageUI.DYNAMIC_TEXTBOX, value, viewIDName);
        return await this.pressTabToDynamicTextbox(AbstractPageUI.DYNAMIC_TEXTBOX, viewIDName);
    }

    async inputToDynamicTextBoxLabel(viewIDName: string, value: string) {
        await this.sendValueToDynamicElement(AbstractPageUI.DYNAMIC_TEXTBOX_LABEL, value, viewIDName);
        return browser.sleep(1000);
    }

    async selectDropDownListItemByText(viewId: string, text: string) {
        await this.selectDropDownListByText(AbstractPageUI.DYNAMIC_DROPDOWNLIST, AbstractPageUI.DROPDOWNLIST_ITEM, text, viewId);
        return browser.sleep(1000);
    }

    async clickToDynamicRadioButton(radioBtnName: string) {
        await this.waitForDynamicControlClickAble(AbstractPageUI.DYNAMIC_RADIOBUTTON_BY_TEXT, radioBtnName);
        await this.clickToDynamicElement(AbstractPageUI.DYNAMIC_RADIOBUTTON_BY_TEXT, radioBtnName);
        return browser.sleep(1000);
    }

    async clickToDynamicCheckboxByTextName(checkboxName: string, value: string) {
        return await this.checkToDynamicCheckbox(AbstractPageUI.DYNAMIC_CHECKBOX_FIXED_TEXT, value, checkboxName);
    }

    async getDynamicDropDownValue(Id: string) {
        return await this.getDynamicTextByExecuteJS(
            AbstractPageUI.DYNAMIC_DROPDOWNLIST, Id);
    }

    async getDynamicTextBoxLabelValue(textName: string) {
        return await this.getDynamicValueByExecuteJS(
            AbstractPageUI.DYNAMIC_TEXTBOX_LABEL, textName);
    }

    async getDynamicLabelText(textName: string) {
        return await this.getDynamicTextByExecuteJS(
            AbstractPageUI.DYNAMIC_LABEL_TEXT, textName);
    }

    async getDynamicDateTimeTextBoxValue(Id: string) {
        return await this.getDynamicValueByExecuteJS(
            AbstractPageUI.DYNAMIC_TEXTBOX, Id);
    }

    async getStateOfCheckboxButton(fieldName: string): Promise<boolean> {
        return await this.getStateOfDynamicCheckbox(AbstractPageUI.DYNAMIC_CHECKBOX_FIXED_TEXT, fieldName);
    }

    async getStateOfRadioButton(fieldName: string): Promise<boolean> {
        let state = false
        let classValue = await this.getDynamicAttributeValue(AbstractPageUI.DYNAMIC_RADIOBUTTON_BY_TEXT_STATE, "class", fieldName);
        if (classValue.includes("is-checked"))
            state = true;
        return state
    }

    async getTextInfor(textName: string) {
        // wait for text ready
        await browser.sleep(5000);
        // check infor for flight booking detail
        if (textName.toLowerCase() == 'flights') {
            textName = 'flights-detail'
        }
        else if (textName.toLowerCase() == 'flights') {
            textName = 'flights-detail'
        }
        else if (textName.toLowerCase() == 'travellers') {
            textName = 'flights-travellers'
        }
        else if (textName.toLowerCase() == 'totals') {
            textName = 'flights-total'
        }

        return await this.getDynamicTextByExecuteJS(AbstractPageUI.DYNAMIC_TEXT_FIELD, textName);
    }

    async getRealDate(time: string, numberDays: string, formatDate: string) {
        let date = new Date().toString();

        if (time === "greater") {
            date = this.formatDateTimes(this.addDays(new Date(), parseInt(numberDays)), formatDate);
        }
        else if (time === "less") {
            date = this.formatDateTimes(this.addDays(new Date(), -parseInt(numberDays)), formatDate);
        }
        return date;
    }

    async getDynamicValidationMessage(fieldName: string, controlType: string) {
        let classAtrribute = '', role = '';
        if (controlType.includes("textbox")) {
            classAtrribute = 'TextField';
            role = 'alert';

        }
        else if (controlType.includes("dropdown")) {
            classAtrribute = 'ComboBox';
            role = 'region';

        }
        return await this.getDynamicTextByExecuteJS(AbstractPageUI.DYNAMIC_VALIDATION_TEXTBOX, fieldName, classAtrribute, role);
    }


    async waitForServerProcessing(second: string) {
        let counter;
        console.log("------ Waiting for server process ------");
        if (isNullOrUndefined(second) || second == '') {
            counter = 50;
        }
        else counter = parseInt(second);
        for (let i = counter; i > 0; i--) {
            console.log(i + " second(s) remaining");
            await browser.sleep(1000);
        }
        console.log("------ Test is continue executing ------");
    }
}
