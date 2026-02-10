const PaymentProvider = require("./PaymentProvider");

function calculateSubscriptionEndDate(startDateStr, durationMonths) {
  const allowedDurations = [1, 3, 6, 12];

  if (!allowedDurations.includes(durationMonths)) {
    throw new Error("Недопустимая длительность подписки");
  }

  const { day, month, year } = parseRussianDate(startDateStr);

  if (!isValidDate(day, month, year)) {
    throw new Error("Некорректная дата начала");
  }

  const totalMonths = year * 12 + (month - 1) + durationMonths;
  const endYear = Math.floor(totalMonths / 12);
  const endMonth = (totalMonths % 12) + 1;

  const lastDayOfEndMonth = getDaysInMonth(endMonth, endYear);
  const endDay = Math.min(day, lastDayOfEndMonth);

  return formatRussianDate(endDay, endMonth, endYear);
}

async function calculateSubscriptionWithPayment(
  userId,
  startDateStr,
  durationMonths
) {
  const transaction = await PaymentProvider.getLastTransaction(userId);

  if (transaction.status === "DECLINED") {
    throw new Error("Транзакция отклонена");
  }

  if (transaction.status === "PENDING") {
    throw new Error("Транзакция в обработке");
  }

  if (transaction.status !== "SUCCESS") {
    throw new Error("Неизвестный статус транзакции");
  }

  return calculateSubscriptionEndDate(startDateStr, durationMonths);
}

function parseRussianDate(dateStr) {
  const parts = dateStr.trim().toLowerCase().split(/\s+/);

  if (parts.length !== 3) {
    throw new Error("Неверный формат даты");
  }

  const day = Number(parts[0]);
  const month = MONTHS[parts[1]];
  const year = Number(parts[2]);

  if (!day || !month || !year) {
    throw new Error("Некорректные значения даты");
  }

  return { day, month, year };
}

function formatRussianDate(day, month, year) {
  return `${day} ${MONTH_NAMES_GENITIVE[month]} ${year}`;
}

function isValidDate(day, month, year) {
  if (year < 1) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  return day <= getDaysInMonth(month, year);
}

function getDaysInMonth(month, year) {
  const isLeapYear =
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const daysPerMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];

  return daysPerMonth[month - 1];
}

const MONTHS = {
  "января": 1,
  "февраля": 2,
  "марта": 3,
  "апреля": 4,
  "мая": 5,
  "июня": 6,
  "июля": 7,
  "августа": 8,
  "сентября": 9,
  "октября": 10,
  "ноября": 11,
  "декабря": 12
};

const MONTH_NAMES_GENITIVE = {
  1: "января",
  2: "февраля",
  3: "марта",
  4: "апреля",
  5: "мая",
  6: "июня",
  7: "июля",
  8: "августа",
  9: "сентября",
  10: "октября",
  11: "ноября",
  12: "декабря"
};

module.exports = {
  calculateSubscriptionEndDate,
  calculateSubscriptionWithPayment,
  isValidDate
};
