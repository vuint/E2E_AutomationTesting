import { AbstractPageObject } from '../pages/abstractPage';
import { SearchFlightPageObject } from '../pages/searchFlightPage';
import { defineSupportCode, TableDefinition } from 'cucumber';
import { expect } from '../helpers/chai-imports';
import { Constants } from "../helpers/constants";

defineSupportCode(async function ({ Then }) {
    const abstractPage = new AbstractPageObject();
    const searchFlightPage = new SearchFlightPageObject();
    const listFlightSection = Constants.FLIGHT_DATA_SECTION;

    Then(
        /^The search flight results should be displayed as following data$/,
        { timeout: 5 * 60000 },
        async (table: TableDefinition) => {
            const tableRows = table.hashes();
            const tableCols = table.raw()[0];
            for (const row of tableRows) {
                let columnName: string,
                    sectionNumer = 0,
                    expectValue: string,
                    actualResult;

                let rowIndex = tableRows.indexOf(row);
                rowIndex = rowIndex + 1;

                for (let i = 0; i < tableCols.length; i++) {
                    columnName = tableCols[i];
                    expectValue = row[columnName];

                    if (Object.keys(listFlightSection).indexOf(columnName) > -1) {
                        sectionNumer = await searchFlightPage.convertflexibleSection(
                            columnName
                        );
                    }

                    actualResult = await searchFlightPage.getFlightRowSectionInfor(
                        rowIndex.toString(),
                        sectionNumer.toString()
                    );
                    actualResult = abstractPage.replaceAllText(actualResult, " ", "\n");

                    if (columnName == "Price") {
                        let actualResultInfor = actualResult.split(" ");
                        actualResult = actualResultInfor[0];
                    }

                    console.log("Actual result: " + actualResult);
                    console.log("Expected result: " + expectValue);
                    expect(expectValue).to.equal(actualResult.trim());
                }
            }
        }
    );

    Then(
        /^The summary booking flight information should display as following data$/, { timeout: 5 * 60000 }, async (table: TableDefinition) => {
            const tableRows = table.hashes();
            const tableCols = table.raw()[0];
            for (const row of tableRows) {
                let columnName: string, expectValue: string, actualResult;

                let rowIndex = tableRows.indexOf(row);
                rowIndex = rowIndex + 1;

                for (let i = 0; i < tableCols.length; i++) {
                    columnName = tableCols[i];
                    expectValue = row[columnName];

                    actualResult = await searchFlightPage.getBookingFlightInfor(columnName);

                    actualResult = abstractPage.replaceAllText(actualResult, " ", "\n");

                    actualResult = actualResult.replace(columnName, "");

                    if (columnName == "Price") {
                        let actualResultInfor = actualResult.split(" ");
                        actualResult = actualResultInfor[0];
                    }

                    console.log("Actual result: " + actualResult);
                    console.log("Expected result: " + expectValue);
                    expect(expectValue).to.equal(actualResult.trim());
                }
            }
        }
    );
});
