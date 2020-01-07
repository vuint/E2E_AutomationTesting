import { AbstractPageObject } from "../pages/abstractPage";
import { Constants } from "../helpers/constants";
import { defineSupportCode, TableDefinition } from "cucumber";
import { expect } from "../helpers/chai-imports";
import { isNullOrUndefined } from "util";
import { browser } from "protractor";



defineSupportCode(async function ({ Given, When, Then }) {
  const abstractPage = new AbstractPageObject();
  const glb_timeout: number = Constants.GLOBAL_TIMEOUT;
  const formatDate = Constants.FormatDate;


  When(/^I click to "(.*?)" button$/, async (buttonName: string) => {
    return await abstractPage.clickDynamicButton(buttonName);
  });

  When(/^I select flight number "(.*?)"$/, async (number: string) => {
    return await abstractPage.clickDynamicFlightBookingButton(number);
  });

  When(
    /^I click on "(.*?)" text checkbox with value "(.*?)"$/,
    async (checkboxTextName: string, value: string) => {
      return await abstractPage.clickToDynamicCheckboxByTextName(
        checkboxTextName,
        value
      );
    }
  );

  When(
    /^I input to "(.*?)" textbox with data "(.*?)"$/, async (textBox: string, value: string) => {
      return await abstractPage.inputToDynamicTextbox(textBox, value);
    }
  );

  When(
    /^I input to "(.*?)" search textbox with data "(.*?)"$/, async (textBox: string, value: string) => {
      if (value.toLowerCase().includes('Code')) {
        value = Constants.BooingCode;
      }
      browser.sleep(1000);
      await abstractPage.inputToSearchTextbox(textBox, value);
      return await browser.sleep(1000);
    }
  );

  When(
    /^I select "(.*?)" in contain dropdown list "(.*?)"$/,
    async (text: string, Id: string) => {
      return await abstractPage.selectDropDownListItemByText(Id, text);
    }
  );

  When(
    /^I input to "(.*?)" datetime textbox with data "(.*?)"$/,
    async (textBox: string, value: string) => {
      if (value != '') {
        value = abstractPage.formatDateTimes(new Date(value), 'EEE MMM dd yyyy'); // ==> Mon Dec 23 2019
      }
      return await abstractPage.inputToDynamicDateTimeTextbox(textBox, value);
    }
  );

  When(
    /^I input to "(.*?)" label textbox  with data "(.*?)"$/,
    async (textBox: string, value: string) => {
      return await abstractPage.inputToDynamicTextBoxLabel(textBox, value);
    }
  );

  When(
    /^I input to "(.*?)" contain datetime textbox with data is "(.*?)" than today "(.*?)" days$/,
    async (textbox: string, time: string, numberDays: string) => {

      let date: string;
      date = await abstractPage.getRealDate(time, numberDays, formatDate);
      return await abstractPage.inputToDynamicDateTimeTextbox(textbox, date);
    }
  );

  When(/^I click on "(.*?)" radio button$/, async (name: string) => {
    return await abstractPage.clickToDynamicRadioButton(name);
  });



  When(/^I get actual value of dropdown list "(.*?)" then compare with expected value "(.*?)"$/, async (fieldName: string, expectedValue: string) => {
    const actualValue = await abstractPage.getDynamicDropDownValue(fieldName);
    return expect(actualValue).to.equal(expectedValue);
  });

  When(/^I get actual value of filter box "(.*?)" then compare with expected value "(.*?)"$/, async (fieldName: string, expectedValue: string) => {
    const actualValue = await abstractPage.getDynamicTextBoxLabelValue(fieldName);
    return expect(actualValue).to.equal(expectedValue);
  });

  When(/^I get actual value of datetime textbox "(.*?)" then compare with expected value "(.*?)"$/, async (fieldName: string, expectedValue: string) => {
    if (expectedValue != '') {
      expectedValue = abstractPage.formatDateTimes(new Date(expectedValue), formatDate);
    }

    const actualValue = await abstractPage.getDynamicDateTimeTextBoxValue(fieldName);
    return expect(actualValue).to.equal(expectedValue);
  });

  When(/^The value of "(.*?)" contain datetime textbox is "(.*?)" than today "(.*?)" days$/, async (textbox: string, time: string, numberDays: string) => {
    let expectedValue = await abstractPage.getRealDate(time, numberDays, formatDate);

    const actualValue = await abstractPage.getDynamicDateTimeTextBoxValue(textbox);
    return expect(actualValue).to.equal(expectedValue);
  });

  When(/^The state of check box "(.*?)" is "(.*?)"$/, async (fieldName: string, status: string) => {
    let state = false;
    if (status.toLowerCase() == 'check' || status.toLowerCase() == 'checked') {
      state = true;
    }

    let actualStatus = await abstractPage.getStateOfCheckboxButton(fieldName);
    return expect(actualStatus).to.equal(state);
  });

  When(/^The state of radio button "(.*?)" is "(.*?)"$/, async (fieldName: string, status: string) => {
    let state = false;
    if (status.toLowerCase() == 'check' || status.toLowerCase() == 'checked') {
      state = true;
    }

    let actualStatus = await abstractPage.getStateOfRadioButton(fieldName);
    return expect(actualStatus).to.equal(state);
  });

  Then(/^The default "(.*?)" information is "(.*?)"$/, async (textName: string, expectValue: string) => {
    let actualResult;
    if(expectValue.includes("Today"))
    {
      let date = abstractPage.formatDateTimes(new Date(), formatDate);
      expectValue = expectValue.replace("Today",date)
    }
  

    actualResult = await abstractPage.getTextInfor(textName);

    actualResult = abstractPage.replaceAllText(actualResult, " ", "\n");

    console.log("Actual: " + actualResult + " Expected: " + expectValue);
    return expect(expectValue).to.equal(actualResult.trim());

  });

  Then(/^The "(.*?)" label should display message "(.*?)" and code "(.*?)"$/, async (label: string, expectedtMessage: string, expectedBookingCode: string) => {
    let actualResult, actualMessage = '', actualCode = '';

    actualResult = await abstractPage.getDynamicLabelText(label);

    actualResult = abstractPage.replaceAllText(actualResult, " ", "\n");
    actualMessage = actualResult.split(":")[0].trim();
    actualCode = actualResult.split(":")[1].trim();


    // get booking Code to use for step search booking
    Constants.BooingCode = actualCode;
    console.log("Booking code: " + Constants.BooingCode);

    console.log("Actual message: " + actualMessage + " Expected message: " + expectedtMessage);
    expect(expectedtMessage).to.equal(actualMessage.trim());

    if (!(isNullOrUndefined(expectedBookingCode) || expectedBookingCode == '')) {
      if (expectedBookingCode.includes('Code')) {
        expectedBookingCode = Constants.BooingCode;
      }
      console.log("Actual code: " + actualCode + " Expected code: " + expectedBookingCode);
      expect(expectedBookingCode).to.equal(actualCode.trim());
    }
    return;
  });

  When(/^I verify at "(.*?)" "(.*?)" show validation message "(.*?)"$/, async (fieldName: string, controlType: string, message: string) => {
    const validationMessage = await abstractPage.getDynamicValidationMessage(fieldName, controlType);
    return expect(validationMessage).to.contain(message);
  });

  When(/^I wait "(.*?)" seconds for server processing$/, { timeout: 5 * 60 * 1000 }, async (second: string) => {
    return await abstractPage.waitForServerProcessing(second);
  })


  When(/^The "(.*?)" page or section should be "(.*?)"$/, async (pageOrSectionTagName: string, status: string) => {
    if (status == 'displayed') {
      await expect(abstractPage.dynamicSectionIsDisplayed(pageOrSectionTagName)).to.eventually.equal(true);
    } else {
      await abstractPage.overrideProtractorTimeOut(5);
      await expect(abstractPage.dynamicSectionIsDisplayed(pageOrSectionTagName)).to.eventually.equal(false);
      return await abstractPage.overrideProtractorTimeOut(glb_timeout);
    }
  });
});

