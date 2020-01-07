@e2e_testing
Feature: SEARCH FLIGHTS

    Scenario Outline: Check search flight defaut data in home page
        Given I visit the demo app
        And The "flight-info" page or section should be "displayed"
        # Defaut search criteria
        And The default "flight-info" information is "Shanghai - Beijing <DefautDate> | 1 TRAVELLERS"
        #And I click on "One Way" radio button
        And The state of radio button "One Way" is "check"
        And I get actual value of dropdown list "From-option" then compare with expected value "<From>"
        And I get actual value of dropdown list "To-option" then compare with expected value "<To>"

        And I get actual value of dropdown list "Adults-option" then compare with expected value "<Adults>"
        And I get actual value of dropdown list "Children-option" then compare with expected value "<Children>"
        And I get actual value of dropdown list "Infants-option" then compare with expected value "<Infants>"
        And I get actual value of dropdown list "classType-option" then compare with expected value "<ClassType>"

        # Defaut date time
        # And I get actual value of datetime textbox "departDate" then compare with expected value ""
        And The value of "departDate" contain datetime textbox is "less" than today "0" days

        # Defaut filer value
        And I get actual value of filter box "From" then compare with expected value "<PriceFrom>"
        And I get actual value of filter box "To" then compare with expected value "<PriceTo>"

        Examples:
            | From     | To      | Adults   | Children   | Infants   | ClassType | PriceFrom | PriceTo | DefautDate |
            | Shanghai | Beijing | 1 Adults | 0 Children | 0 Infants | Economy   | 100       | 1000    | Today      |


    Scenario: Check validaiton for require fields of booking flight
        Given I visit the demo app
        And I select flight number "2"
        And I click to "Buy Now" button

        # Personal infomation
        And I verify at "FirstName" "textbox" show validation message "First name can't be blank"
        And I verify at "LastName" "textbox" show validation message "Last name can't be blank"
        And I verify at "Gender" "dropdown box" show validation message "Gender can't be blank"
        And I verify at "Nationality" "dropdown box" show validation message "Nationality can't be blank"
        And I verify at "PasportId" "textbox" show validation message "Pasport id can't be blank"
        And I verify at "PasportExpiryDateMonth" "textbox" show validation message "Expiry month can't be blank"

        # Payment infomation
        And I verify at "CardNumber" "textbox" show validation message "Card number can't be blank"
        And I verify at "NameOnTheCard" "textbox" show validation message "Name on the card can't be blank"
        And I verify at "ExpiryDateInMonth" "textbox" show validation message "Expiry month can't be blank"
        And I verify at "ExpiryDateInYear" "textbox" show validation message "Expiry year can't be blank"
        And I verify at "CVVCode" "textbox" show validation message "Cvv code can't be blank"

        And I verify at "Country" "dropdown box" show validation message "Country can't be blank"
        And I verify at "BillingAddress" "textbox" show validation message "Billing address can't be blank"
        And I verify at "City" "textbox" show validation message "City can't be blank"
        And I verify at "ZIPCode" "textbox" show validation message "Zip code can't be blank"
        And I verify at "EmailAddress" "textbox" show validation message "Email address can't be blank"
        And I verify at "PhoneNumber" "textbox" show validation message "Phone number can't be blank"


    Scenario Outline: Booking flight
        Given I visit the demo app
        And I select "<From>" in contain dropdown list "From-option"
        And I get actual value of dropdown list "From-option" then compare with expected value "<From>"
        And I select "<To>" in contain dropdown list "To-option"
        And I get actual value of dropdown list "To-option" then compare with expected value "<To>"
        # And I input to "departDate" contain datetime textbox with data is "less" than today "7" days
        And I input to "departDate" datetime textbox with data "<DepartTime>"
        And I get actual value of datetime textbox "departDate" then compare with expected value "<DepartTime>"
        And I select "<Adults>" in contain dropdown list "Adults-option"
        And I get actual value of dropdown list "Adults-option" then compare with expected value "<Adults>"
        And I get actual value of dropdown list "Children-option" then compare with expected value "<Children>"
        And I select "<Infants>" in contain dropdown list "Infants-option"
        And I get actual value of dropdown list "Infants-option" then compare with expected value "<Infants>"
        And I select "<ClassType>" in contain dropdown list "classType-option"
        And I get actual value of dropdown list "classType-option" then compare with expected value "<ClassType>"
        And I click to "Search Flights" button
        Then The search flight results should be displayed as following data
            | Airline                 | DepartFrom                      | Duration        | DepartTo                          | Price |
            | Korean Air A321-211     | 6:23 PM December 29, 2019 Tokyo | 2 days Non stop | 6:23 PM December 31, 2019 Jakarta | $304  |
            | Air Canada A320-214     | 3:05 PM December 29, 2019 Tokyo | 3 days Non stop | 3:05 PM January 1, 2020 Jakarta   | $408  |
            | China Airlines A320-214 | 5:21 PM December 29, 2019 Tokyo | 2 days Non stop | 5:21 PM December 31, 2019 Jakarta | $791  |
            | Thai Airways 757-224    | 2:26 PM December 29, 2019 Tokyo | 2 days Non stop | 2:26 PM December 31, 2019 Jakarta | $888  |

        # Filter price
        And I input to "From" label textbox  with data "<PriceFrom>"
        And I get actual value of filter box "From" then compare with expected value "<PriceFrom>"
        And I get actual value of filter box "To" then compare with expected value "<PriceTo>"

        And I click to "Search Flights" button
        Then The search flight results should be displayed as following data
            | Airline                 | DepartFrom                      | Duration        | DepartTo                          | Price |
            | China Airlines A320-214 | 5:21 PM December 29, 2019 Tokyo | 2 days Non stop | 5:21 PM December 31, 2019 Jakarta | $791  |
            | Thai Airways 757-224    | 2:26 PM December 29, 2019 Tokyo | 2 days Non stop | 2:26 PM December 31, 2019 Jakarta | $888  |

        # Select flight number 1 to book
        And I select flight number "1"
        Then The summary booking flight information should display as following data
            | Flights                                                                            | Travellers                                                                                                            | Totals |
            | Departure Sun Dec 29 2019 17:21:59 Tokyo Tue Dec 31 2019 17:21:59 Jakarta Non stop | $791 $0 x checked bag Insurance $0 free $791 $0 x checked bag Insurance $0 free $0 $0 x checked bag Insurance $0 free | $1582  |

        # Input personal information
        # Person 1
        And I input to "FirstName0" textbox with data "<FirstName0>"
        And I input to "LastName0" textbox with data "<LastName0>"
        And I input to "DateOfBirth0" datetime textbox with data "<BirthDay0>"
        And I input to "Gender0" textbox with data "Male"
        And I input to "Nationality0" textbox with data "<Nationality>"

        And I input to "PasportId0" textbox with data "<PasportId0>"
        And I input to "PasportExpiryDateMonth0" textbox with data "<PasportExpiryDateMonth>"
        And I input to "PasportExpiryDateYear0" textbox with data "<PasportExpiryDateYear>"

        # Person 2
        And I input to "FirstName1" textbox with data "<FirstName1>"
        And I input to "LastName1" textbox with data "<LastName1>"
        And I input to "DateOfBirth1" datetime textbox with data "<BirthDay1>"
        And I input to "Gender1" textbox with data "Female"
        And I input to "Nationality1" textbox with data "<Nationality>"

        And I input to "PasportId1" textbox with data "<PasportId1>"
        And I input to "PasportExpiryDateMonth1" textbox with data "<PasportExpiryDateMonth>"
        And I input to "PasportExpiryDateYear1" textbox with data "<PasportExpiryDateYear>"

        # Person 3
        And I input to "FirstName2" textbox with data "<FirstName2>"
        And I input to "LastName2" textbox with data "<LastName2>"
        And I input to "DateOfBirth2" datetime textbox with data "<BirthDay2>"
        And I input to "Gender2" textbox with data "Female"
        And I input to "Nationality2" textbox with data "<Nationality>"

        And I input to "PasportId2" textbox with data "<PasportId2>"
        And I input to "PasportExpiryDateMonth2" textbox with data "<PasportExpiryDateMonth>"
        And I input to "PasportExpiryDateYear2" textbox with data "<PasportExpiryDateYear>"

        # Payment information
        And I input to "CardNumber" textbox with data "<CardNumber>"
        And I input to "NameOnTheCard" textbox with data "<NameOnTheCard>"
        And I input to "ExpiryDateInMonth" textbox with data "<ExpiryDateInMonth>"
        And I input to "ExpiryDateInYear" textbox with data "<ExpiryDateInYear>"
        And I input to "CVVCode" textbox with data "<CVVCode>"
        And I input to "Country" textbox with data "<Country>"

        And I input to "BillingAddress" textbox with data "<BillingAddress>"
        And I input to "City" textbox with data "<City>"
        And I input to "ZIPCode" textbox with data "<ZIPCode>"
        And I input to "EmailAddress" textbox with data "<EmailAddress>"
        And I input to "PhoneNumber" textbox with data "<PhoneNumber>"



        # Accept rule
        And I click on "I Accept the Rules of this Trip" text checkbox with value "true"
        And I click on "Send Me the Best Deals by Email" text checkbox with value "true"

        And I click to "Buy Now" button
        Examples:
            | From  | To      | DepartTime | Adults   | Children   | Infants   | ClassType | PriceFrom | PriceTo | FirstName0 | LastName0 | FirstName1 | LastName1 | FirstName2 | LastName2 | Nationality | PasportId0   | PasportId1 | PasportId2 | PasportExpiryDateMonth | PasportExpiryDateYear | CardNumber       | NameOnTheCard | ExpiryDateInMonth | ExpiryDateInYear | CVVCode | Country | BillingAddress               | City    | ZIPCode | EmailAddress              | PhoneNumber | BirthDay0  | BirthDay1  | BirthDay2  |
            | Tokyo | Jakarta | 12/29/2019 | 2 Adults | 0 Children | 1 Infants | Economy   | 500       | 1000    | Axon       | Viet Nam  | SB         | AutoTest  | Thanh      | Nguyen    | Vietnamese  | 223344556677 | 1234567890 | 9999999999 | 10                     | 2025                  | 4460990001111222 | Vui Nguyen    | 05                | 2022             | 999     | Vietnam | Tầng 13 Tòa Nhà Dầu Khí 30/4 | Da Nang | 550000  | vui.nguyen@axonactive.com | 0988123456  | 08/08/1980 | 09/20/1988 | 06/28/2019 |
