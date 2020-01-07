import { AbstractPageObject } from '../pages/abstractPage';
import { defineSupportCode } from 'cucumber';
import { expect } from '../helpers/chai-imports';
import { Constants } from '../helpers/constants';

defineSupportCode(async function ({ Given }) {
    const abstractPage = new AbstractPageObject();

    Given(/^I visit the demo app$/, async () => {
        await abstractPage.openDynamicPageByUrl(Constants.URL);
        return expect(await abstractPage.getTitle()).to.equal("HaiLua AirLine");
    });

})