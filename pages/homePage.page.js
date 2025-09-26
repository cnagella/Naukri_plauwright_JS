/**
 * @typedef {import('@playwright/test').Page} Page
 */
const { expect, test } = require('@playwright/test');

class HomePage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = page;
    this.early_access_roles_loc = page.locator("//div[@class='spc__header']//a[text()='View all']", { timeout: 10000 });
    this.share_interest_loc = page.locator('//div[@class="tlc__tuple"]//button', { timeout: 10000 });
    this.early_Access_header_text_loc = page.locator("//header[@class='lp__header']/p");
    this.early_access_company_names_loc = page.locator("//span[contains(@class,'comp-name')]" );
    this.share_interest_success_msg_loc = page.locator("//span[@class='apply-message typ-14Medium']");
  }
  async gotoearlyAccessRolesTab() {
    await this.page.waitForLoadState('load',{timeout:60000});
    await this.early_access_roles_loc.click();
    await test.step("Verify early access roles page", async () => {
      await expect(this.page).toHaveTitle("Early access roles | Mynaukri");
      await test.info().attach("Current URL", {
        body: await this.page.url(),
        contentType: "text/plain"
      });
    });
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.page.waitForSelector("//span[contains(@class,'comp-name')]");
  }
  async shareInterestToAllEarlyAccessJobs() {
  let iteration = 1;

  while (true) {
    //  Check header count (like "44 Early access roles...")
    await this.page.waitForTimeout(1000);
    const headerText = await this.early_Access_header_text_loc.textContent();
    const match = headerText?.match(/^(\d+)/);   // extract number at start
    const headerCount = match ? parseInt(match[1], 10) : 0;
    console.log("the header count is: ", headerCount);

    if (headerCount === 0) {
      console.log("🎉 You shared your interest to all the listed companies.");
      break;
    }
    await this.page.waitForTimeout(1000);
    //  Double-check if button exists
    const jobCount = await this.share_interest_loc.count();
    console.log("the job count is: ",jobCount);
    if (jobCount === 0) {
      console.log("⚠️ No 'Share interest' buttons found, but header shows count. Skipping...");
      break;
    }
    await test.step(`Iteration ${iteration}`, async () => {
      const companyName = await this.early_access_company_names_loc.first().textContent();
      console.log(`➡️ Sharing interest for: ${companyName}`);

      // click the first available button
      await this.share_interest_loc.first().click();

      // wait for success message on the new page
      await expect(this.share_interest_success_msg_loc).toBeVisible();
      const message = await this.share_interest_success_msg_loc.textContent();

      // attach success message for reporting
      await test.info().attach(`Job ${iteration} - ${companyName}`, {
        body: message || "",
        contentType: "text/plain"
      });

      console.log(`✅ ${companyName}: ${message}`);

      // navigate back to Early Access Roles
      const currentUrl = this.page.url();
      if (!currentUrl.includes("recommended-earjobs")) {
        await this.page.goBack({ timeout: 30000 });
        await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
      }
    });
    iteration++;
  }
}
}
module.exports = { HomePage };
