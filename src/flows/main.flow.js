const celitixService = require("../services/celitix.service");
const crmService = require("../services/crm.service");
const supportFlow = require("./support.flow");
const renewalFlow = require("./renewal.flow");
const sessionStore = require("../utils/session.store");

exports.handleText = async (number, text) => {
  const lower = text.toLowerCase().trim();

  // PRIMARY KEYWORDS
  // if (["hi", "hello", "hiiiiii", "hii", "hey"].includes(lower)) {
  //   return sendWelcome(number);
  // }
  if (["impressivebot"].includes(lower)) {
    return sendWelcome(number);
  }

  if (["help", "support"].includes(lower)) {
    return supportFlow.startSupport(number);
  }

  if (["sales", "buy", "renew"].includes(lower)) {
    return renewalFlow.startRenewal(number);
  }

  // return celitixService.sendText(number, "Please type Hi to start.");
};

exports.handleList = async (number, listId) => {
  console.log("List Clicked:", listId);

  if (listId.startsWith("product_") || listId.startsWith("product")) {
    return supportFlow.handleProductSelection(number, listId);
  }

  switch (listId) {
    case "support":
      return supportFlow.startSupport(number);

    case "renewal":
      return renewalFlow.startRenewal(number);

    case "new_requirement":
      return newRequirementFlow.start(number);

    case "other":
      return celitixService.sendText(
        number,
        "Please describe your requirement.",
      );

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
    console.log("🔍 Checking CRM for:", number);

    const response = await crmService.getNumberDetails(number);

    console.log("📦 CRM Response:", response);

    // CASE A → Single Contact Found
    if (response.status === "success" && response.data?.record_name) {
      const name = response.data.record_name;

      await celitixService.sendText(
        number,
        `Happy to have you connected Mr./Ms./M/s ${name}

How can I help you today?`,
      );

      return sendMainMenuList(number);
    }

    // CASE C → No Record Found
    if (response.status === "error") {
      await celitixService.sendText(
        number,
        `Oops! Unable to fetch any record for this number as of now. hence the list of related data can not be populated. 

Please select the need from option below.`,
      );

      return sendMainMenuList(number);
    }
  } catch (error) {
    console.error("❌ CRM Error:", error.message);

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
    " Please choose an option by replying with the number:",
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

