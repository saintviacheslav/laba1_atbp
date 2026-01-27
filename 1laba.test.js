const {
  calculateSubscriptionEndDate
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
});
