jest.mock("./PaymentProvider", () => ({
  getLastTransaction: jest.fn()
}));

const PaymentProvider = require("./PaymentProvider");
const {
  calculateSubscriptionEndDate,
  calculateSubscriptionWithPayment,
  isValidDate,
} = require("./1laba");

describe("calculateSubscriptionEndDate — расчёт даты окончания подписки", () => {
  describe("корректные подписки", () => {
    test("добавление 1 месяца в пределах одного года", () => {
      const result = calculateSubscriptionEndDate("14 марта 2025", 1);
      expect(result).toBe("14 апреля 2025");
    });

    test("добавление 3 месяцев с переходом на следующий год", () => {
      const result = calculateSubscriptionEndDate("10 декабря 2023", 3);
      expect(result).toBe("10 марта 2024");
    });

    test("добавление 6 месяцев", () => {
      const result = calculateSubscriptionEndDate("5 января 2024", 6);
      expect(result).toBe("5 июля 2024");
    });

    test("добавление 12 месяцев (полный год)", () => {
      const result = calculateSubscriptionEndDate("20 июня 2022", 12);
      expect(result).toBe("20 июня 2023");
    });
  });

  describe("месяцы с разным количеством дней", () => {
    test("31 января + 1 месяц → февраль (високосный год)", () => {
      const result = calculateSubscriptionEndDate("31 января 2024", 1);
      expect(result).toBe("29 февраля 2024");
    });

    test("31 января + 1 месяц → февраль (невисокосный год)", () => {
      const result = calculateSubscriptionEndDate("31 января 2023", 1);
      expect(result).toBe("28 февраля 2023");
    });

    test("30 ноября + 3 месяца → февраль", () => {
      const result = calculateSubscriptionEndDate("30 ноября 2023", 3);
      expect(result).toBe("29 февраля 2024");
    });
  });

  describe("некорректная длительность подписки", () => {
    test("ошибка при неподдерживаемой длительности", () => {
      expect(() =>
        calculateSubscriptionEndDate("10 марта 2024", 2)
      ).toThrow("Недопустимая длительность подписки");
    });

    test("ошибка при отрицательной длительности", () => {
      expect(() =>
        calculateSubscriptionEndDate("10 марта 2024", -1)
      ).toThrow("Недопустимая длительность подписки");
    });
  });

  describe("некорректный формат даты", () => {
    test("ошибка при неверном формате", () => {
      expect(() =>
        calculateSubscriptionEndDate("2024-03-10", 1)
      ).toThrow("Неверный формат даты");
    });

    test("ошибка при отсутствии частей даты", () => {
      expect(() =>
        calculateSubscriptionEndDate("10 марта", 1)
      ).toThrow("Неверный формат даты");
    });
  });

  describe("некорректные значения даты", () => {
    test("31 февраля — недопустимая дата", () => {
      expect(() =>
        calculateSubscriptionEndDate("31 февраля 2024", 1)
      ).toThrow("Некорректная дата начала");
    });

    test("день равен нулю", () => {
      expect(() =>
        calculateSubscriptionEndDate("0 марта 2024", 1)
      ).toThrow("Некорректные значения даты");
    });

    test("неизвестное название месяца", () => {
      expect(() =>
        calculateSubscriptionEndDate("10 мартабля 2024", 1)
      ).toThrow("Некорректные значения даты");
    });

    test("отрицательный год", () => {
      expect(() =>
        calculateSubscriptionEndDate("10 марта -2024", 1)
      ).toThrow("Некорректная дата начала");
    });
  });
  describe("некорректные значения даты — проверка isValidDate", () => {

  test("месяц 0 → false", () => {
    expect(isValidDate(15, 0, 2025)).toBe(false);
  });

  test("месяц отрицательный → false", () => {
    expect(isValidDate(10, -3, 2024)).toBe(false);
  });

  test("месяц 13 → false", () => {
    expect(isValidDate(5, 13, 2025)).toBe(false);
  });

  test("месяц 15 → false", () => {
    expect(isValidDate(20, 15, 2023)).toBe(false);
  });

  test("день 0 → false", () => {
    expect(isValidDate(0, 6, 2025)).toBe(false);
  });

  test("день отрицательный → false", () => {
    expect(isValidDate(-1, 12, 2024)).toBe(false);
  });
});
});

  test("DECLINED — продление запрещено", async () => {
    PaymentProvider.getLastTransaction.mockResolvedValue({
      status: "DECLINED"
    });

    await expect(
      calculateSubscriptionWithPayment(2, "10 марта 2024", 1)
    ).rejects.toThrow("Транзакция отклонена");
  });

  test("PENDING — продление запрещено", async () => {
    PaymentProvider.getLastTransaction.mockResolvedValue({
      status: "PENDING"
    });

    await expect(
      calculateSubscriptionWithPayment(3, "10 марта 2024", 3)
    ).rejects.toThrow("Транзакция в обработке");
  });

  test("неизвестный статус транзакции", async () => {
    PaymentProvider.getLastTransaction.mockResolvedValue({
      status: "CANCELLED"
    });

    await expect(
      calculateSubscriptionWithPayment(4, "10 марта 2024", 1)
    ).rejects.toThrow("Неизвестный статус транзакции");
  });

  test("ошибка платёжного сервиса (reject)", async () => {
    PaymentProvider.getLastTransaction.mockRejectedValue(
      new Error("Payment service down")
    );

    await expect(
      calculateSubscriptionWithPayment(5, "10 марта 2024", 1)
    ).rejects.toThrow("Payment service down");
  });
describe("успешный сценарий — оплата прошла, дата считается", () => {
  test("SUCCESS → должен вызвать calculateSubscriptionEndDate и вернуть её результат", async () => {
    PaymentProvider.getLastTransaction.mockResolvedValue({
      status: "SUCCESS",
    });

    const startDate = "15 мая 2025";
    const months = 3;
    
    const result = await calculateSubscriptionWithPayment(999, startDate, months);
    expect(result).toBe("15 августа 2025");
  })});
describe("сложный сценарий — расчёт даты НЕ выполняется", () => {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(
      require("./1laba"),
      "calculateSubscriptionEndDate"
    );
  });

  afterEach(() => {
    spy.mockRestore();
    jest.clearAllMocks();
  });

  test("DECLINED — расчёт даты не вызывается", async () => {
    PaymentProvider.getLastTransaction.mockResolvedValue({
      status: "DECLINED"
    });

    await expect(
      calculateSubscriptionWithPayment(100, "10 марта 2024", 1)
    ).rejects.toThrow();

    expect(spy).not.toHaveBeenCalled();
  });

  test("PENDING — расчёт даты не вызывается", async () => {
    PaymentProvider.getLastTransaction.mockResolvedValue({
      status: "PENDING"
    });

    await expect(
      calculateSubscriptionWithPayment(101, "10 марта 2024", 3)
    ).rejects.toThrow();

    expect(spy).not.toHaveBeenCalled();
  });
  
})
