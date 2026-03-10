const { Given, When, Then } = require("@cucumber/cucumber");
const request = require("supertest");
const app = require("../../server");
const { calculateSubscriptionEndDate } = require("../../1laba");

let context = {
  userId: null,
  lastTransaction: null,
  extendResponse: null,
  startDate: null,
  durationMonths: null
};

Given("сервис доступен по адресу {string}", async function (path) {
  const res = await request(app).get(path);
  if (res.status !== 200 || res.body.status !== "online") {
    throw new Error("Сервис недоступен");
  }
});

Given("существует пользователь с идентификатором {string}", function (userId) {
  context.userId = userId;
});

Given("я запрашиваю последний платеж этого пользователя", async function () {
  const res = await request(app).get(
    `/api/payments/last-transaction/${context.userId}`
  );

  context.lastTransaction = res.body;
});

Given(
  "дата последнего платежа используется как дата начала подписки",
  function () {
    if (!context.lastTransaction || !context.lastTransaction.lastPaymentDate) {
      throw new Error("Нет даты последнего платежа");
    }
    context.startDate = context.lastTransaction.lastPaymentDate;
  }
);

When("я продлеваю подписку на {int} месяцев", async function (months) {
  context.durationMonths = months;

  const res = await request(app)
    .post("/api/subscription/extend")
    .send({
      userId: context.userId,
      startDate: context.startDate,
      durationMonths: context.durationMonths
    });

  context.extendResponse = res;
});

When("я пытаюсь продлить подписку на {int} месяцев", async function (months) {
  context.durationMonths = months;

  const startDate =
    context.startDate || "31 декабря 2024";

  const res = await request(app)
    .post("/api/subscription/extend")
    .send({
      userId: context.userId,
      startDate,
      durationMonths: context.durationMonths
    });

  context.extendResponse = res;
});

Then("API возвращает статус-код {int}", function (code) {
  if (!context.extendResponse) {
    throw new Error("Ответ продления подписки отсутствует");
  }
  if (context.extendResponse.status !== code) {
    throw new Error(
      `Ожидался статус ${code}, получен ${context.extendResponse.status}`
    );
  }
});

Then(
  "ответ содержит успешное продление с длительностью {int} месяцев",
  function (months) {
    const res = context.extendResponse;
    if (res.status !== 200) {
      throw new Error("Ожидался успешный ответ 200");
    }

    const body = res.body;

    if (body.userId !== context.userId) {
      throw new Error("Некорректный userId в ответе");
    }

    if (body.durationMonths !== months) {
      throw new Error("Некорректная длительность подписки в ответе");
    }

    const expectedEndDate = calculateSubscriptionEndDate(
      body.startDate,
      months
    );

    if (body.endDate !== expectedEndDate) {
      throw new Error(
        `Неверная дата окончания подписки. Ожидалось "${expectedEndDate}", получено "${body.endDate}"`
      );
    }
  }
);

Then("ответ содержит сообщение об ошибке {string}", function (expected) {
  const res = context.extendResponse;
  if (res.status === 200) {
    throw new Error(
      `Ожидалась ошибка "${expected}", но запрос завершился успешно`
    );
  }

  const message = res.body && res.body.error;

  if (!message || !message.includes(expected)) {
    throw new Error(
      `Ожидалась ошибка, содержащая "${expected}", но пришло: "${message}"`
    );
  }
});

