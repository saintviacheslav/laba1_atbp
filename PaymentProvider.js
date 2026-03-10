module.exports = {
  async getLastTransaction(userId) {
    if (userId === "declined") {
      return { status: "DECLINED", date: "15 декабря 2024" };
    }

    if (userId === "pending") {
      return { status: "PENDING" };
    }

    if (userId === "unknown") {
      return { status: "ERROR" };
    }

    return { status: "SUCCESS", date: "31 декабря 2024" };
  },
};
