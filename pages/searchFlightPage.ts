import { Common } from "../helpers/common";
import { Constants } from "../helpers/constants";
import { SearchFlightPageUI } from "../interfaces/searchFlightPage.ui";

export class SearchFlightPageObject extends Common {
  constructor() {
    super();
  }

  listFlightDataSection = Constants.FLIGHT_DATA_SECTION;

  async convertflexibleSection(sectionName: string) {
    console.log("Flight information: " + sectionName);
    for (let key of Object.keys(this.listFlightDataSection)) {
      if (key == sectionName) {
        break;
      }
    }
    let sectionNumber = await this.listFlightDataSection[sectionName];
    return sectionNumber;
  }

  async getFlightRowSectionInfor(rowNumber: string, sectionNumber: string) {
    return await this.getDynamicTextByExecuteJS(
      SearchFlightPageUI.DYNAMIC_FLIGHT_ROW_SECTION_NUMBER,
      rowNumber,
      sectionNumber
    );
  }

  async getBookingFlightInfor(textName: string) {
    // check infor for flight booking detail
    if (textName.toLowerCase() == 'flights') {
      textName = 'flights-detail'
    }
    else if (textName.toLowerCase() == 'travellers') {
      textName = 'flights-travellers'
    }
    else if (textName.toLowerCase() == 'totals') {
      textName = 'flights-total'
    }

    return await this.getDynamicTextByExecuteJS(SearchFlightPageUI.DYNAMIC_BOOKING_FLIGHT_DETAIL, textName);
  }
}
