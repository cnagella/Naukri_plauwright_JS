/**
 * @typedef {import('@playwright/test').Page} Page
 */

const { expect } = require('@playwright/test');

class HomePage{
    /**
   * @param {Page} page
   */
    constructor(page){
        this.page = page;
        this.early_access_roles_loc = page.locator("//div[@class='spc__header']//a[text()='View all']"); 
        this.share_interest_loc = page.locator('//div[@class="tlc__tuple"]//button',{ timeout: 10000 });  
        this.early_Access_header_text_loc = page.locator("//header[@class='lp__header']/p");     
    }
    async gotoearlyAccessRolesTab(){
        await this.early_access_roles_loc.click();
        console.log(this.page.url());
        await expect(this.page).toHaveTitle("Early access roles | Mynaukri");
        await this.page.setViewportSize({ width: 1920, height: 1080 });
    }
    async shareInterestToAllEarlyAccessJobs(){
        const text = await this.early_Access_header_text_loc.textContent();
        console.log("early access text is: ", text);
        await this.share_interest_loc.first().waitFor();
        const countOfSahreInterestBtns = await this.share_interest_loc.count();
        console.log("count of the shae interest items: ", countOfSahreInterestBtns);
        for (let i = 0; i < countOfSahreInterestBtns; i++) {
            const btn = this.share_interest_loc.nth(i);
            await btn.scrollIntoViewIfNeeded();
            await btn.waitFor({ state: 'visible' });
            await btn.click();
            console.log("Navigated to:", await this.page.url());
            await this.page.waitForTimeout(1000);
            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'load' }),
                this.page.goBack()
            ]);
            await this.share_interest_loc.first().waitFor(); // re-wait after navigation
        }
    }
}
module.exports={ HomePage};