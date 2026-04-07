const form = document.getElementById("subscription-form");
const userIdInput = document.getElementById("userId");
const monthsSelect = document.getElementById("months");
const resultText = document.getElementById("result-text");
const errorText = document.getElementById("error-text");

async function getLastTransaction(userId) {
  const res = await fetch(`/api/payments/last-transaction/${encodeURIComponent(userId)}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Не удалось получить последний платеж");
  }

  return data;
}

async function extendSubscription(payload) {
  const res = await fetch("/api/subscription/extend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Ошибка продления подписки");
  }

  return data;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorText.textContent = "";
  resultText.textContent = "Выполняется запрос...";

  const userId = userIdInput.value.trim();
  const durationMonths = Number(monthsSelect.value);

  if (!userId) {
    resultText.textContent = "";
    errorText.textContent = "Введите корректный ID пользователя";
    return;
  }

  try {
    const tx = await getLastTransaction(userId);
    const startDate = tx.lastPaymentDate;

    const extension = await extendSubscription({
      userId,
      startDate,
      durationMonths
    });

    resultText.textContent =
      `Продление успешно. Новая дата окончания: ${extension.endDate}`;
  } catch (error) {
    resultText.textContent = "";
    errorText.textContent = error.message;
  }
});
