import {
  browser,
  by,
  promise,
  element,
  ElementFinder,
  ElementArrayFinder,
  protractor
} from "protractor";
import { format, isNullOrUndefined } from "util";
var axios = require("axios");

export class Common {
  timeout = 50 * 1000;
  condition = browser.ExpectedConditions;
  protected findElement(locator: string): ElementFinder {
    try {
      let control: ElementFinder;
      if (locator.startsWith("css=")) {
        locator = locator.substring(4);
        control = element(by.css(locator));
      } else if (locator.startsWith("xpath=")) {
        locator = locator.substring(6);
        control = element(by.xpath(locator));
      }
      return control;
    } catch (locator) {
      console.error("Not found " + `${locator}` + " element");
      return null;
    }
  }

  // Find dynamic list elements
  protected findAllElements(locator: string): ElementArrayFinder {
    try {
      let controls: ElementArrayFinder;
      if (locator.startsWith("css=")) {
        locator = locator.substring(4);
        controls = element.all(by.css(locator));
      } else if (locator.startsWith("xpath=")) {
        locator = locator.substring(6);
        controls = element.all(by.xpath(locator));
      }
      return controls;
    } catch (locator) {
      console.log("Not found " + `${locator}` + " elements");
      return null;
    }
  }

  async sendKeyToElement(locator: string, value: string) {
    try {
      const element_ = await this.findElement(locator);
      await element_.clear();
      await browser.sleep(800);
      await element_.sendKeys(value);
      return await browser.sleep(800);
    } catch (er) {
      console.error("There is error: " + er);
    }
  }
  async sendKeyToDynamicElement(
    locator: string,
    text: string,
    ...value: string[]
  ) {
    try {
      const element_ = await this.findElement(format(locator, ...value));
      await browser.sleep(800);
      await element_.clear();
      await browser.sleep(800);
      await element_.sendKeys(text);
      return await browser.sleep(800);
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async sendValueToDynamicElement(
    locator: string,
    text: string,
    ...value: string[]
  ) {
    try {
      const element_ = await this.findElement(format(locator, ...value));
      await browser.sleep(800);
      await element_.click();
      await browser.sleep(200);
      await element_.click();
      await this.pressCtrlAKey()
      await browser.sleep(800);
      // await element_.clear();
      // await browser.sleep(2000);
      await element_.sendKeys(text);
      return await browser.sleep(800);
    } catch (er) {
      console.error("There is error: " + er);
    }
  }



  async clearDynamicTextValueByJs(elementId: string) {
    return document.getElementById(elementId).setAttribute("value", "");
  }

  async clickToElement(locator: string) {
    try {
      const element_ = await this.findElement(locator);
      return await element_.click();
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async clickToDynamicElement(locator: string, ...value: string[]) {
    try {
      locator = format(locator, ...value);
      console.log("Click to dynamic element = " + locator);
      const element_ = await this.findElement(locator);
      return await element_.click();
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async clickByExecuteJS(locator: string) {
    try {
      const element_ = await this.findElement(locator);
      return await browser.executeScript("arguments[0].click();", element_);
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async clickByDynamicExecuteJS(locator: string, ...value: string[]) {
    try {
      locator = format(locator, ...value);
      console.log("Click to dynamic element = " + locator);
      const element_ = await this.findElement(locator);
      return await browser.executeScript("arguments[0].click();", element_);
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async countDynamicElement(locator: string, value: string): Promise<number> {
    try {
      const elements_ = this.findAllElements(format(locator, value));
      return await elements_.count();
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async countElement(locator: string): Promise<number> {
    try {
      const elements_ = this.findAllElements(locator);
      return await elements_.count();
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async isControlDisplayed(locator: string): Promise<boolean> {
    try {
      const element_ = await this.findElement(locator);
      return element_.isDisplayed();
    } catch (e) {
      console.error("Control is not displayed. " + e);
    }
  }

  async isDynamicControlDisplayed(
    locator: string,
    ...value: string[]
  ): Promise<boolean> {
    try {
      locator = format(locator, ...value);
      const element_ = await this.findElement(locator);
      return await element_.isDisplayed();
    } catch (e) {
      console.error("Control is not displayed. " + e);
    }
  }

  async getTextDynamicElement(
    locator: string,
    ...value: string[]
  ): Promise<string> {
    try {
      locator = format(locator, ...value);
      await browser.sleep(800);
      const element_ = await this.findElement(locator);
      return await element_.getText();
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  // async getValueByExecuteJS(fieldName: string) {
  //     try {
  //         document.querySelector("input[name='title']")
  //         return browser.executeScript(`return $("input[name='title']").value`);
  //     }
  //     catch (er) {
  //         console.error("There is error: " + er);
  //     }
  // }

  async waitForControlVisible(locator: string) {
    try {
      const element_ = await this.findElement(locator);
      return browser.wait(
        this.condition.visibilityOf(element_),
        this.timeout,
        "Control at: " + locator + " can not be visible."
      );
    } catch (e) {
      console.error("Control not visible. " + e);
    }
  }

  async waitForDynamicControlVisible(locator: string, ...value: string[]) {
    try {
      locator = format(locator, ...value);
      const element_ = await this.findElement(locator);
      return browser.wait(
        this.condition.visibilityOf(element_),
        this.timeout,
        "Control at: " + locator + " can not be visible."
      );
    } catch (e) {
      console.log(e.message);
      console.error("Control not visible. " + e);
    }
  }

  async scrollToElement(locator: string) {
    try {
      const element_ = await this.findElement(locator);
      return await browser.executeScript(
        "arguments[0].scrollIntoView();",
        element_
      );
    } catch (e) {
      console.error("There is error " + e);
    }
  }

  async scrollToDynamicElement(locator: string, ...value: string[]) {
    try {
      const element_ = await this.findElement(format(locator, ...value));
      return await browser.executeScript(
        "arguments[0].scrollIntoView();",
        element_
      );
    } catch (e) {
      console.error("There is error " + e);
    }
  }

  async scrollToRealElement(element: ElementFinder) {
    try {
      return await browser.executeScript(
        "arguments[0].scrollIntoView();",
        element
      );
    } catch (e) {
      console.error("There is error " + e);
    }
  }

  // inDom (locator: ElementFinder) {
  //     return protractor.ExpectedConditions.presenceOf (locator);
  //   }

  //   notInDom (locator: ElementFinder) {
  //     return protractor.ExpectedConditions.stalenessOf (locator);
  //   }

  async getTitle(): Promise<string> {
    try {
      return await browser.getTitle();
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async isControlPresent(locator: string): Promise<boolean> {
    try {
      const element_ = await this.findElement(locator);
      return await element_.isPresent();
    } catch (e) {
      console.error("Control is not presented." + e);
    }
  }

  async openURL(url: string) {
    try {
      await browser.get(url);
      await browser
        .manage()
        .timeouts()
        .implicitlyWait(this.timeout);
      return browser
        .manage()
        .timeouts()
        .pageLoadTimeout(this.timeout);
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async waitForDynamicControlPresence(locator: string, ...value: string[]) {
    try {
      locator = format(locator, ...value);
      const element_ = await this.findElement(locator);
      return browser.wait(
        this.condition.presenceOf(element_),
        this.timeout,
        "Control at: " + locator + " can not be present"
      );
    } catch (e) {
      console.error("Control is not present. " + e);
    }
  }

  async getAttributeValue(
    locator: string,
    attributeName: string
  ): Promise<string> {
    try {
      const element_ = await this.findElement(locator);
      return await element_.getAttribute(attributeName);
    } catch (e) {
      console.error("There is error " + e);
    }
  }
  async getDynamicAttributeValue(
    locator: string,
    attributeName: string,
    ...value: string[]
  ): Promise<string> {
    try {
      locator = format(locator, ...value);
      const element_ = await this.findElement(locator);
      return await element_.getAttribute(attributeName);
    } catch (e) {
      console.error("There is error " + e);
    }
  }

  async waitForDynamicControlClickAble(locator: string, ...value: string[]) {
    try {
      locator = format(locator, ...value);
      console.log("Wait dynamic element clickable = " + locator);
      const element_ = await this.findElement(locator);
      return browser.wait(
        this.condition.elementToBeClickable(element_),
        this.timeout,
        "Control at: " + locator + " can not be clickable"
      );
    } catch (e) {
      console.error("Control can not be clickable. " + e);
    }
  }

  async pressTabToDynamicTextbox(locator: string, ...value: string[]) {
    try {
      const element_ = await this.findElement(format(locator, ...value));
      return await element_.sendKeys(protractor.Key.TAB);
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async selectDropDownListByText(
    dropDownListLocator: string,
    listItemLocator: string,
    selectedText: string,
    ...value: string[]
  ) {
    try {
      await browser.sleep(1000);
      await this.waitForDynamicControlClickAble(dropDownListLocator, ...value);
      // await this.clickToDynamicElement(dropDownListLocator, ...value);
      await this.clickByDynamicExecuteJS(dropDownListLocator, ...value);

      await browser.sleep(2000);
      let isDropdownShow = await this.isControlDisplayed(listItemLocator + "/..");

      console.log("1. List Item " + listItemLocator + "/.." + " ready is: " + isDropdownShow);

      // Re-click to dropdown to handle the case that cannot select value on 1st dropdown then tab to 2nd dropdown
      if (!isDropdownShow) {
        await browser.sleep(2000);
        // await this.clickToDynamicElement(dropDownListLocator, ...value);
        await this.clickByDynamicExecuteJS(dropDownListLocator, ...value);
        await browser.sleep(2000);
        isDropdownShow = await this.isControlDisplayed(listItemLocator + "/..");
        console.log("2. List Item " + listItemLocator + "/.." + " ready is: " + isDropdownShow);
      }

      // await this.overrideProtractorTimeOut(this.timeout / 1000);
      let listItem = this.findAllElements(listItemLocator);
      let total = await listItem.count();

      if (total == 0 && isDropdownShow == false) {
        console.log("Item " + selectedText + " cannot be selected!!!");
      } else {
        console.log("Total Item: " + total);
        console.log("Item to be selected: " + selectedText);
        for (let i = 0; i < total; i++) {
          let element = await listItem.get(i);
          await this.scrollToRealElement(element);
          // let itemText = await element.getText();
          let itemText = await this.getElementAttributeValue(element, "title");
          let state = await this.getElementAttributeValue(element, "aria-selected");
          console.log("Text of Item: " + itemText);
          console.log("State of Item: " + state);

          if (isNullOrUndefined(state) || state != "true") {
            state = "false";
          }

          if (itemText == selectedText) {
            if (state != "true") {
              console.log("Click: " + itemText);
              await element.click();
            } else {
              console.log("Item " + selectedText + " is already selected!");
              await this.pressTabButton();
            }
            break;
          }
        }
      }
    } catch (e) {
      console.error("There is error " + e);
    }
  }

  async overrideProtractorTimeOut(time: number) {
    return await browser
      .manage()
      .timeouts()
      .implicitlyWait(time * 1000);
  }

  async getElementAttributeValue(
    element: ElementFinder,
    attributeName: string
  ): Promise<string> {
    try {
      return await element.getAttribute(attributeName);
    } catch (e) {
      console.error("There is error " + e);
    }
  }

  async scrollToPageWithDynamicPixel(pixcelRange: string) {
    var pixcelNumber: number = parseInt(pixcelRange);
    return await browser.executeScript(
      `window.scrollBy(0,` + pixcelNumber + `);`
    );
  }

  async checkToDynamicCheckbox(locator: string, status: string, ...value: string[]) {
    try {
      locator = format(locator, ...value);
      const state = await this.isControlSelected(locator);
      if (state.toString() != status) {
        return await this.clickByExecuteJS(locator);
      }
    } catch (e) {
      console.error('Can not check to checkbox. ' + e);
    }
  }

  async isControlSelected(locator: string): Promise<boolean> {

    try {
      const element_ = await this.findElement(locator);
      return await element_.isSelected();
    } catch (e) {
      console.error('Control is not selected. ' + e);
    }
  }

  async isDynamicControlSelected(locator: string, ...value: string[]): Promise<boolean> {
    try {
      const element_ = await this.findElement(format(locator, ...value));
      return await element_.isSelected();
    } catch (e) {
      console.error('Control is not selected. ' + e);
    }
  }

  async pressEnterButton() {
    try {
      return await browser
        .actions()
        .sendKeys(protractor.Key.ENTER)
        .perform();
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async pressTabButton() {
    try {
      return await browser
        .actions()
        .sendKeys(protractor.Key.TAB)
        .perform();
    } catch (er) {
      console.error("There is error: " + er);
    }
  }

  async pressCtrlAKey() {
    try {
      return await browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a")).perform();
    }
    catch (er) {
      console.error("There is error: " + er);
    }
  }

  async getDynamicTextByExecuteJS(locator: string, ...value: string[]) {
    // tslint:disable-next-line:quotemark
    try {
      const element_ = format(locator, ...value).substring(6);
      return await browser.executeScript(`return document.evaluate("` + element_ + `", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText;`);
    }
    catch (er) {
      console.error("There is error: " + er);
    }
  }

  async getDynamicValueByExecuteJS(locator: string, ...value: string[]) {
    // tslint:disable-next-line:quotemark
    try {
      const element_ = format(locator, ...value).substring(6);
      return await browser.executeScript(`return document.evaluate("` + element_ + `", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value;`);
    }
    catch (er) {
      console.error("There is error: " + er);
    }
  }

  async getStateOfDynamicCheckbox(locator: string, ...value: string[]): Promise<boolean> {
    try {
      locator = format(locator, ...value);
      const state = await this.isControlSelected(locator);
      return state;
    }
    catch (e) {
      console.error('Can not get state of checkbox. ' + e);
    }
  }

  replaceAllText(originalValue: string, replaceValue: string, symbol: string) {
    let result = originalValue.split(symbol).join(replaceValue);
    return result;
  }
  formatDate(inputDate: string) {
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    var date = new Date(inputDate);
    return date
      .toLocaleDateString("en-UK", options)
      .split(",")
      .join(""); //Friday July 8 1988
  }


  formatDateTimes(date, formatStr) {

    var monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];

    var dayOfWeekNames = [
      "Sunday", "Monday", "Tuesday",
      "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    if (!formatStr) {
      formatStr = 'dd/mm/yyyy';
    }
    var day = date.getDate(),
      month = date.getMonth(),
      year = date.getFullYear(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds(),
      miliseconds = date.getMilliseconds(),
      hh = this.twoDigitPad(hour),
      mm = this.twoDigitPad(minute),
      ss = this.twoDigitPad(second),
      EEEE = dayOfWeekNames[date.getDay()],
      EEE = EEEE.substr(0, 3),
      dd = this.twoDigitPad(day),
      M = month + 1,
      MM = this.twoDigitPad(M),
      MMMM = monthNames[month],
      MMM = MMMM.substr(0, 3),
      yyyy = year + "",
      yy = yyyy.substr(2, 2)
      ;
    return formatStr
      .replace('hh', hh).replace('h', hour)
      .replace('mm', mm).replace('m', minute)
      .replace('ss', ss).replace('s', second)
      .replace('S', miliseconds)
      .replace('dd', dd).replace('d', day)
      .replace('MMMM', MMMM).replace('MMM', MMM).replace('MM', MM).replace('M', M)
      .replace('EEEE', EEEE).replace('EEE', EEE)
      .replace('yyyy', yyyy)
      .replace('yy', yy)
      ;
    //console.log(formatDate(new Date())); ==> 23/05/2019
    // console.log(formatDates(new Date(), 'EEEE, MMMM d, yyyy hh:mm:ss:S'));  ==> Monday, December 23, 2019 18:05:53:862
    // console.log(formatDates(new Date(), 'EEE, MMM d, yyyy hh:mm')); ==> Mon, Dec 23, 2019 18: 05
    // console.log(formatDates(new Date(), 'yyyy-MM-dd hh:mm:ss:S')); ==>  2019 - 12 - 23 18: 05: 53: 862
    // console.log(formatDates(new Date(), 'yy-MM-dd hh:mm')); ==>  19 - 12 - 23 18: 05

  }

  twoDigitPad(num: string | number) {
    return num < 10 ? "0" + num : num;
  }


  addDays(date: Date, days: number) {
    date.setDate(date.getDate() + days);
    return date;
  }
  /**
   * API methods
   *
   * @param theUrl
   * @param autUsername
   * @param autPassword
   */
  async httpGetAsync(theUrl, autUsername, autPassword) {
    let response;
    try {
      console.log("Start send request!");
      response = await axios.get(theUrl, {
        withCredentials: true,
        auth: {
          username: autUsername,
          password: autPassword
        }
      });
    } catch (error) {
      response = await error;
    } finally {
      await console.log(response);
    }
  }

  async httpAPIGet(theUrl, autUsername, autPassword) {
    let response;
    var basicAuth = "Basic " + autUsername + ":" + autPassword;
    try {
      console.log("Start send request!");
      response = await axios.get(theUrl, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        auth: {
          username: autUsername,
          password: autPassword
        },
        responseType: "application/json"
      });
    } catch (error) {
      response = await error;
    } finally {
      await response;
      return response;
    }
  }

  async httpAPIPost(theUrl, autUsername, autPassword, bodyJson) {
    let response;
    var basicAuth = "Basic " + autUsername + ":" + autPassword;
    try {
      console.log("Start send request!");
      response = await axios.post(theUrl, bodyJson, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        auth: {
          username: autUsername,
          password: autPassword
        },
        responseType: "application/json"
      });
    } catch (error) {
      response = await error;
    } finally {
      await response;
      return response;
    }
  }
}
