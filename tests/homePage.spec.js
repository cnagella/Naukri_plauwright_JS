const {test, expect}= require('@playwright/test');
const {LoginPage} = require('../pages/login.page');
const {HomePage}= require("../pages/homePage.page");
const testData = JSON.parse(JSON.stringify(require('../utils/creds.json')));


test('Verify user is navigating to the recommended jobs tab', async ({page})=>{
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.login(testData.username, testData.password);
    const homePage = new HomePage(page);
    await homePage.gotoearlyAccessRolesTab();
    await homePage.shareInterestToAllEarlyAccessJobs();
})