import { Common } from "../helpers/common";
import { LoginPageUI } from "../interfaces/login.ui";

export class LoginPageObject extends Common {
  constructor() {
    super();
  }

  async typeToEmail(username: string) {
    await this.waitForControlVisible(LoginPageUI.USERNAME_TXT).then(
      async () => {
        return await this.sendKeyToElement(LoginPageUI.USERNAME_TXT, username);
      }
    );
  }

  async typeToPassword(password: string) {
    return await this.sendKeyToElement(LoginPageUI.PASSWORD_TXT, password);
  }

  async clickToLoginButton() {
    return await this.clickToElement(LoginPageUI.SIGNIN_BTN);
  }

  async loginToSystem(username: string, password: string) {
    await this.typeToEmail(username).then(async () => {
      await this.typeToPassword(password).then(async () => {
        return await this.clickToLoginButton();
      });
    });
  }
}
