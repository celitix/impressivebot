const celitixService = require("../services/celitix.service");
const crmService = require("../services/crm.service");
const supportFlow = require("./support.flow");
const renewalFlow = require("./renewal.flow");
const sessionStore = require("../utils/session.store");
const newRequirementFlow = require("./newRequirement.flow");
const otherNeedFlow = require("./otherNeed.flow");

// if client need different key word to target the flow then we can use this handler to trigger the flow instead of list message. for ex - if user types "support" then we can directly trigger support flow without sending the list message.
exports.handleText = async (number, text) => {
  const lower = text.toLowerCase().trim();

  // PRIMARY KEYWORDS
  if (["hi", "hello", "hiiiiii", "hii", "hey"].includes(lower)) {
    return sendWelcome(number);
  }
  // if (["impressivebot"].includes(lower)) {
  //   return sendWelcome(number);
  // }

  if (["help", "support"].includes(lower)) {
    return supportFlow.startSupport(number);
  }

  if (["sales", "buy", "renew"].includes(lower)) {
    return renewalFlow.startRenewal(number);
  }

  // return celitixService.sendText(number, "Please type Hi to start.");

  // option 1
  //   return celitixService.sendText(
  //     number,
  //     `👋 Welcome to Impressive Star!

  // I’m here to assist you. Please type one of the following to continue:

  // • *Hi* – Start fresh
  // • *Support* – Get technical help
  // • *Renew* – Renewal assistance
  // • *Sales* – New enquiries`,
  //   );


  // option 2
//   return celitixService.sendText(
//     number,
//     `🙏 Thank you for reaching out to Impressive Star.

// To get started, please type *Hi* so we can assist you with the available options.`,
//   );
};

exports.handleList = async (number, listId) => {
  console.log("List Clicked:", listId);

  if (listId.startsWith("product_") || listId.startsWith("product")) {
    return supportFlow.handleProductSelection(number, listId);
  }

  if (listId.startsWith("category_")) {
    return newRequirementFlow.handleCategorySelection(number, listId);
  }

  switch (listId) {
    case "support":
      return supportFlow.startSupport(number);

    case "renewal":
      return renewalFlow.startRenewal(number);

    case "new_requirement":
      return newRequirementFlow.startNewRequirement(number);

    case "other":
      return otherNeedFlow.startOtherNeed(number);

    default:
      return celitixService.sendText(number, "Invalid selection.");
  }
};

// Welcome message trigger -------------------------

async function sendWelcome(number) {
  await celitixService.sendText(
    number,
    `👋 Welcome to Impressive Star!
    Glad to have you with us today. Plz wait while we search for related records of your number.
Businesses are flourishing by doing process optimisation through ERP, HRMS, CRM, Cloud
& Mobile Access, Tally Customisation.

Support Hours: On Weekdays, 10:00 AM to 6:00 PM
You can contact us directly:
📧 support@impressivestar.com
📞 0141-4041515
www.impressivestar.com

Certified Solution Partner of Tally Solution since 1993`,
  );

  try {
    console.log("Checking CRM for:", number);

    const response = await crmService.getNumberDetails(number);

    console.log("CRM Response:", response);

    // CASE A → Single Contact Found
    if (response.status === "success" && response.data?.record_name) {
      const name = response.data.record_name;
      const session = sessionStore.getSession(number);
      session.recordName = name;
      sessionStore.setSession(number, session);

      await celitixService.sendText(
        number,
        `Happy to have you connected Mr./Ms./M/s ${name}`,
      );

      return sendMainMenuList(number);
    }

    // CASE C → No Record Found
    //     if (response.status === "error") {
    //       await celitixService.sendText(
    //         number,
    //         `Oops! Unable to fetch any record for this number as of now. hence the list of related data can not be populated.

    // Please select the need from option below.`,
    //       );

    //       return sendMainMenuList(number);
    //     }
    if (response.status === "error") {
      await celitixService.sendText(
        number,
        `⚠️ We could not locate any existing record associated with this number in our system.

As a result, the related account details could not be retrieved.

To assist you better, kindly fill out the short form below so our team can understand your requirement and get back to you promptly.`,
      );

      // Reset previous session
      sessionStore.clearSession(number);

      const session = sessionStore.getSession(number);

      // store flow context
      session.flowType = "lead_capture";

      sessionStore.setSession(number, session);

      console.log("SESSION AFTER LEAD FLOW SET:", session);

      return celitixService.sendFlowMessage(
        number,
        "New Enquiry Form",
        "Please share your details so we can assist you.",
        "Impressive Star",
        "navigate",
        // "2144483762964142",
        // "2068747380648091",
        // "1243209594101965", // impressivebotall - proactive acc
        "4290553851218752", // impressivebotall - impressive acc
        "Fill Form",
        "WELCOME",
      );
    }
  } catch (error) {
    console.error("CRM Error:", error.message);

    await celitixService.sendText(
      number,
      `System is temporarily unable to verify your details.
Please choose from the options below.`,
    );

    return sendMainMenuList(number);
  }
}

async function sendMainMenuList(number) {
  return celitixService.sendListMessage(
    number,
    "How can I help you today?",
    "Please choose an option from the list below:",
    "View Options",
    [
      {
        title: "Select Your Need",
        rows: [
          {
            id: "support",
            title: "Support Needed",
            description: "Raise a support request",
          },
          {
            id: "renewal",
            title: "Renewal Required",
            description: "Renew your product/service",
          },
          {
            id: "new_requirement",
            title: "New Requirement",
            description: "Discuss new service/product",
          },
          {
            id: "other",
            title: "Other Need",
            description: "Other queries",
          },
        ],
      },
    ],
  );
}
