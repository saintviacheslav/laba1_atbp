const { expect } = require("@playwright/test");

class SubscriptionPage {
  constructor(page) {
    this.page = page;
    this.userIdInput = page.locator("#userId");
    this.monthsSelect = page.locator("#months");
    this.extendButton = page.locator("#extend-btn");
    this.resultText = page.locator('[data-testid="result-text"]');
    this.errorText = page.locator('[data-testid="error-text"]');
  }

  async open() {
    await this.page.goto("/");
  }

  async fillUserId(userId) {
    await this.userIdInput.fill(userId);
  }

  async selectMonths(months) {
    await this.monthsSelect.selectOption(String(months));
  }

  async submit() {
    await this.extendButton.click();
  }

  async extendFor(userId, months) {
    await this.fillUserId(userId);
    await this.selectMonths(months);
    await this.submit();
  }

  async expectSuccessWithDatePart(expectedDatePart) {
    await expect(this.errorText).toHaveText("");
    await expect(this.resultText).toContainText("Продление успешно");
    await expect(this.resultText).toContainText(expectedDatePart);
  }

  async expectErrorContains(errorPart) {
    await expect(this.errorText).toContainText(errorPart);
  }
}

module.exports = { SubscriptionPage };
