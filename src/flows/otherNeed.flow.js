const celitixService = require("../services/celitix.service");
const sessionStore = require("../utils/session.store");

exports.startOtherNeed = async (number) => {
  // reset previous session
  sessionStore.clearSession(number);

  const session = sessionStore.getSession(number);

  session.flowType = "other_need";

  sessionStore.setSession(number, session);

  await celitixService.sendText(
    number,
    `Thank you for reaching out to *Impressive Star*.

Please share the details with us by filling out the short form below. Our team will review your request and connect with you shortly to assist you further.`,
  );

  return celitixService.sendFlowMessage(
    number,
    "Other Requirement Form",
    "Please provide details about your request.",
    "Impressive Star",
    "navigate",
    // "2144483762964142",
    // "2068747380648091",
    // "1243209594101965", // impressivebotall - proactive acc
    "4290553851218752", // impressivebotall - impressive acc
    "Open Form",
    "WELCOME",
  );
};
