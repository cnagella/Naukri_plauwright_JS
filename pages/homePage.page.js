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
    this.early_access_company_names_loc = page.locator("//span[contains(@class,'comp-name')]", );
    this.share_interest_success_msg_loc = page.locator("//span[@class='apply-message typ-14Medium']");
  }
  async gotoearlyAccessRolesTab() {
    await this.page.waitForLoadState('load');
    await this.early_access_roles_loc.click();

    await test.step("Verify early access roles page", async () => {
      await expect(this.page).toHaveTitle("Early access roles | Mynaukri");
      await test.info().attach("Current URL", {
        body: await this.page.url(),
        contentType: "text/plain"
      });
    });
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }
  async shareInterestToAllEarlyAccessJobs() {
  let iteration = 1;
  let jobCount = await this.share_interest_loc.count();
  console.log(`🔎 Found ${jobCount} jobs to share interest`);

  while (await this.share_interest_loc.count() > 0) {
    await test.step(`Iteration ${iteration}`, async () => {
      const companyName = await this.early_access_company_names_loc.first().textContent();
      console.log(`➡️ Sharing interest for: ${companyName}`);

      // click the first available button
      await this.share_interest_loc.first().click();

      // wait for success message on the new page
      await expect(this.success_message_loc).toBeVisible();

      const message = await this.success_message_loc.textContent();

      // attach success message for reporting
      await test.info().attach(`Job ${iteration} - ${companyName}`, {
        body: message || "",
        contentType: "text/plain"
      });

      console.log(`✅ ${companyName}: ${message}`);

      // navigate back to Early Access Roles
      await this.page.goBack();
      await this.page.waitForLoadState('domcontentloaded');
    });

    iteration++;
    jobCount = await this.share_interest_loc.count();
  }

  console.log("🎉 Completed sharing interest for all available jobs.");
}
}

module.exports = { HomePage };
