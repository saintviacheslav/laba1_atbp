const express = require("express");
const {
  calculateSubscriptionEndDate,
  calculateSubscriptionWithPayment
} = require("./1laba");

const PaymentProvider = require("./PaymentProvider");

const app = express();
app.use(express.json());

app.get("/api/status", (req, res) => {
  res.status(200).json({
    status: "online",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/payments/last-transaction/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transaction = await PaymentProvider.getLastTransaction(userId);

    res.status(200).json({
      userId,
      status: transaction.status,
      lastPaymentDate: transaction.date
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/subscription/extend", async (req, res) => {
  try {
    const { userId, startDate, durationMonths } = req.body;

    if (!userId || !startDate || !durationMonths) {
      return res.status(400).json({
        error: "Отсутствуют обязательные поля"
      });
    }

    const endDate = await calculateSubscriptionWithPayment(
      userId,
      startDate,
      durationMonths
    );

    res.status(200).json({
      userId,
      startDate,
      durationMonths,
      endDate
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;