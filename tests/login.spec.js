const {test, expect}= require('@playwright/test');
const {LoginPage}= require("../pages/login.page");

test('Verify login functionality of naukri url', async ({page})=>{
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.login("pattemvenkatasurendra@gmail.com", "Venkat@1903");
    console.log(await page.url());
    await expect(page).toHaveURL(/mnjuser/);
    await page.waitForTimeout(5000);

})