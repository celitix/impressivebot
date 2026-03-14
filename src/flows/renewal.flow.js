const celitixService = require("../services/celitix.service");
const sessionStore = require("../utils/session.store");

exports.startRenewal = async (number) => {
  // clear previous session
  sessionStore.clearSession(number);

  const session = sessionStore.getSession(number);

  session.flowType = "renewal_request";

  sessionStore.setSession(number, session);

  await celitixService.sendText(
    number,
    `Thank you for choosing to renew your services with *Impressive Star*.

To submit your renewal request, please provide the required details in the form below. Our team will review your request and assist you with the renewal process.`,
  );

  return celitixService.sendFlowMessage(
    number,
    "Renewal Request Form",
    "Please fill the renewal details",
    "Impressive Star Renewal",
    "navigate",
    // "2144483762964142",
    // "2068747380648091",
    // "1243209594101965", // impressivebotall - proactive acc
    "4290553851218752", // impressivebotall - impressive acc
    "Submit Request",
    "WELCOME",
  );
};
