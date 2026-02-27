const celitixService = require("../services/celitix.service");
const sessionStore = require("../utils/session.store");

exports.startRenewal = async (number) => {
  const session = sessionStore.getSession(number);
  session.step = "renewal_details";

  await celitixService.sendText(
    number,
    `Please provide:
1. Full Name
2. Contact Number
3. Company Name
4. Tally Serial Number`,
  );
};
