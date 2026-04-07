const { test } = require("@playwright/test");
const { SubscriptionPage } = require("../pages/SubscriptionPage");

test.describe("UI: продление подписки (вариант 11)", () => {
  let subscriptionPage;

  test.beforeEach(async ({ page }) => {
    subscriptionPage = new SubscriptionPage(page);
    await subscriptionPage.open();
  });

  test("Позитивный сценарий: успешное продление для статуса OK", async () => {
    await subscriptionPage.extendFor("user1", 3);
    await subscriptionPage.expectSuccessWithDatePart("31 марта 2025");
  });

  test("Негативный сценарий: статус Declined -> ошибка", async () => {
    await subscriptionPage.extendFor("declined", 3);
    await subscriptionPage.expectErrorContains("Транзакция отклонена");
  });

  test("Негативный сценарий: некорректный ID пользователя", async () => {
    await subscriptionPage.extendFor("", 3);
    await subscriptionPage.expectErrorContains("Введите корректный ID пользователя");
  });

  const plans = [
    { months: 1, expectedDate: "31 января 2025" },
    { months: 3, expectedDate: "31 марта 2025" },
    { months: 6, expectedDate: "30 июня 2025" },
    { months: 12, expectedDate: "31 декабря 2025" }
  ];

  for (const plan of plans) {
    test(`Data-Driven: корректная дата для тарифа ${plan.months} мес.`, async () => {
      await subscriptionPage.extendFor("user1", plan.months);
      await subscriptionPage.expectSuccessWithDatePart(plan.expectedDate);
    });
  }
});
