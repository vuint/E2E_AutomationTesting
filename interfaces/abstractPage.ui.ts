export class AbstractPageUI {
  public static readonly ALL_CONTROL = `xpath=//div[contains(@class,'overlay-container')]`;
  public static readonly DYNAMIC_PAGE_OR_SECTION_DISPLAYED = `xpath=//%s`;
  public static readonly DYNAMIC_DATATABLE_FIXED_HEADER_COLUMN = `xpath=//table[@name='%s']//th[contains(text(),'%s')]`;
  public static readonly DYNAMIC_CELL_VALUE_WITH_ROW_COLUMN = `xpath=//table[@name='%s']//tr[@id='%s']/td[@column='%s']/div[contains(text(),'%s')]`;
  public static readonly DYNAMIC_BTN = `xpath=//button[contains(.,'%s')]`;
  public static readonly DYNAMIC_TEXTBOX = `xpath=//input[contains(@id,'%s')]`;
  public static readonly DYNAMIC_TEXTBOX_LABEL = `xpath=//label[contains(text(),'%s')]/..//input`;
  public static readonly DYNAMIC_LABEL_TEXT = `xpath=//label[contains(@class,'%s')]`;
  public static readonly DYNAMIC_RADIOBUTTON_BY_TEXT = `xpath=//input[@type='radio']/following-sibling::label/span[text()='%s']`;
  public static readonly DYNAMIC_RADIOBUTTON_BY_TEXT_STATE = `xpath=//input[@type='radio']/following-sibling::label/span[text()='%s']/..`;
  public static readonly DYNAMIC_FILTER_BOX = `xpath=//div[contains(.,'%s')]/following-sibling::div/input`;
  public static readonly DYNAMIC_DROPDOWNLIST = `xpath=//div/span[contains(@id,'%s')]`;
  public static readonly DROPDOWNLIST_ITEM = `xpath=//div[@role='listbox']/button`;
  public static readonly DYNAMIC_FLIGHT_NUMBER_BOOKING_BUTTON = `xpath=//div[contains(@class,'ms-Card')][%s]//button`;
  public static readonly DYNAMIC_CHECKBOX_FIXED_TEXT = `xpath=//input[@type='checkbox' and @aria-label='%s']`
  public static readonly DYNAMIC_TEXT_FIELD = `xpath=//div[contains(@class,'%s')]`
  public static readonly DYNAMIC_VALIDATION_TEXTBOX = `xpath=//input[contains(@id,'%s')]/ancestor::div[contains(@class,'%s')]//div[@role='%s']`











}
