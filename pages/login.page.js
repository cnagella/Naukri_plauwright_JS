/**
 * @typedef {import('@playwright/test').Page} Page
 */
class LoginPage{
    /**
   * @param {Page} page
   */
    constructor(page){
        this.page = page;
        this.login_btn_loc = page.getByRole('link', { name: 'Login', exact: true });
        this.username_loc = page.getByRole('textbox', { name: 'Enter your active Email ID /' });
        this.password_loc = page.getByRole('textbox', { name: 'Enter your password' });
        this.loginPopup_loginBtn_loc = page.getByRole('button', { name: 'Login', exact: true });
    }
    async gotoLoginPage(){
        await this.page.goto("https://www.naukri.com/", { waitUntil: 'load', timeout: 10000});
        // await this.page.waitForLoadState('load');
    }
    async login(username,password){
        await this.login_btn_loc.click();
        await this.username_loc.click();
        await this.username_loc.fill(username);
        await this.password_loc.click();
        await this.password_loc.fill(password);
        await this.loginPopup_loginBtn_loc.click();
        await this.page.waitForTimeout(3000);
    }
}
module.exports={ LoginPage};