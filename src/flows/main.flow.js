const celitixService = require("../services/celitix.service");
const crmService = require("../services/crm.service");
const supportFlow = require("./support.flow");
const renewalFlow = require("./renewal.flow");
const sessionStore = require("../utils/session.store");

// exports.handleText = async (number, text) => {
//   const session = sessionStore.getSession(number);
//   const lower = text.toLowerCase().trim();

//   // MENU RESET
//   if (lower === "menu") {
//     sessionStore.clearSession(number);
//     return sendWelcome(number);
//   }

//   // PRIMARY KEYWORDS
//   // if (["hi", "hello", "hiiiiii", "hii", "hey"].includes(lower)) {
//   //   return sendWelcome(number);
//   // }
//   if (["impressivebot"].includes(lower)) {
//     return sendWelcome(number);
//   }

//   // MAIN MENU OPTIONS
//   if (["1", "2", "3", "4"].includes(lower)) {
//     switch (lower) {
//       case "1":
//         return supportFlow.startSupport(number);
//       case "2":
//         return renewalFlow.startRenewal(number);
//       case "3":
//         return talkToTeam(number);
//       case "4":
//         return celitixService.sendText(
//           number,
//           "Please briefly describe your requirement.",
//         );
//     }
//   }

//   // Support sub handling
//   if (session.step?.startsWith("support")) {
//     return supportFlow.handleSupportSteps(number, text);
//   }

//   return celitixService.sendText(
//     number,
//     "Sorry, I didn't understand that.\nPlease reply with valid option (1-4) or type MENU.",
//   );
// };

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

  return celitixService.sendText(number, "Please type Hi to start.");
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

Support Hours: Mon–Fri, 10 AM–6 PM
📧 support@impressivestar.com
📞 0141-4041515
www.impressivestar.com`,
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
        `Oops! Unable to fetch any record for this number as of now.

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
    "How can we assist you?",
    "Please choose an option:",
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

async function talkToTeam(number) {
  await celitixService.sendText(
    number,
    `Please provide:
🔹 Full Name
🔹 Company Name
🔹 Brief Issue Description`,
  );
}
