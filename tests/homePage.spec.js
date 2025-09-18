const {test, expect}= require('@playwright/test');
const {LoginPage} = require('../pages/login.page');
const {HomePage}= require("../pages/homePage.page");

const username = process.env.USERNAME;
const password = process.env.PASSWORD;


test('Verify user is navigating to the recommended jobs tab', async ({page})=>{
    const loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage();
    await loginPage.login(username, password);
    const homePage = new HomePage(page);
    await homePage.gotoearlyAccessRolesTab();
    await homePage.shareInterestToAllEarlyAccessJobs();
})