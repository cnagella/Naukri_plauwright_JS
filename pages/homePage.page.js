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
    this.early_access_company_names_loc = page.locator("//span[contains(@class,'comp-name')]", { timeout: 10000 });
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
  const text = await this.early_Access_header_text_loc.textContent();
  await this.share_interest_loc.first().waitFor();
  const totalJobs = await this.share_interest_loc.count();

  let successCount = 0;
  let logs = [];

  await test.step("Early access header info", async () => {
    await test.info().attach("Header text", {
      body: `Early access text: ${text}`,
      contentType: "text/plain"
    });
    await test.info().attach("Total jobs", {
      body: `Total early access jobs listed: ${totalJobs}`,
      contentType: "text/plain"
    });
  });

  for (let i = 0; i < totalJobs; i++) {
    await test.step(`Iteration ${i + 1}`, async () => {
      // fresh locators every time
      const companyLocator = this.early_access_company_names_loc.nth(i);
      const buttonLocator = this.share_interest_loc.nth(i);

      try {
        const comp_name = await companyLocator.textContent();
        await buttonLocator.scrollIntoViewIfNeeded();
        await buttonLocator.click();

        // wait for success message
        await this.share_interest_success_msg_loc.waitFor({ timeout: 5000 });
        const msg = await this.share_interest_success_msg_loc.textContent();

        const logLine = `${comp_name} - ${msg}`;
        logs.push(logLine);
        successCount++;

        // per iteration log
        await test.info().attach(`Result ${i + 1}`, {
          body: logLine,
          contentType: "text/plain"
        });

        // go back to list
        await Promise.all([
          this.page.waitForLoadState("load"),
          this.page.goBack()
        ]);
        await this.share_interest_loc.first().waitFor();

      } catch (err) {
        await this.page.waitForTimeout(5000);
        const comp_name = await companyLocator.textContent();
        const logLine = `${comp_name} - Failed to share interest`;
        logs.push(logLine);

        await test.info().attach(`Result ${i + 1}`, {
          body: logLine,
          contentType: "text/plain"
        });
      }
    });
  }

  let remaining = totalJobs - successCount;

  // add summary at the end
  logs.push(`\nTotal successfully shared interest: ${successCount}`);
  logs.push(`Remaining not shared: ${remaining}`);
}
}

module.exports = { HomePage };
