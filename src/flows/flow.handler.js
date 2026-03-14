const crmService = require("../services/crm.service");
const celitixService = require("../services/celitix.service");
const sessionStore = require("../utils/session.store");

const FIELD_MAP = {
  textInput_one: "Full Name",
  textInput_two: "Company Name",
  textInput_three: "Mobile Number",
  textInput_four: "Email",
  textInput_five: "Tally Serial No",
  textInput_six: "GST No",
  textArea_one: "Description",
};

function formatFlowData(responseData) {
  let description = "";
  let formattedDetails = "*User Submitted Details:*\n\n";

  Object.entries(responseData).forEach(([key, value]) => {
    if (key === "flow_token") return;

    const label = FIELD_MAP[key] || key;

    description += `${label}: ${value}\n`;

    formattedDetails += `• *${label}:* ${value}\n`;
  });

  return { description, formattedDetails };
}

// main handler for all flow submissions
exports.handleFlowResponse = async (number, flowReply) => {
  try {
    const session = sessionStore.getSession(number);
    console.log("SESSION DATA:", session);

    // const responseData = JSON.parse(flowReply.response_json);
    let responseData;

    if (typeof flowReply.response_json === "string") {
      responseData = JSON.parse(flowReply.response_json);
    } else {
      responseData = flowReply.response_json;
    }

    console.log("FLOW RESPONSE:", responseData);

    const flowType = session.flowType;
    console.log("FLOW TYPE:", flowType);

    if (!flowType) {
      console.log("⚠️ Unknown flow submission");
      return;
    }

    switch (flowType) {
      case "support_ticket":
        return handleSupportTicket(number, session, responseData);

      case "lead_capture":
        return handleLeadCapture(number, responseData);

      case "renewal_request":
        return handleRenewalRequest(number, responseData);

      case "new_requirement":
        return handleNewRequirement(number, session, responseData);

      case "other_need":
        return handleOtherNeed(number, session, responseData);

      default:
        console.log("Unknown Flow Type:", flowType);
        return;
    }
  } catch (error) {
    console.error("Flow Error:", error.message);

    return celitixService.sendText(
      number,
      "Something went wrong while processing your request.",
    );
  }
};

// handle support ticket flow submission
async function handleSupportTicket(number, session, responseData) {
  const selectedProduct = session.selectedProduct;

  if (!selectedProduct) {
    return celitixService.sendText(
      number,
      "Session expired. Please start again.",
    );
  }
  const { formattedDetails } = formatFlowData(responseData);

  await celitixService.sendText(number, formattedDetails);

  // const ticketResponse = await crmService.createTicket(
  //   description,
  //   number,
  //   selectedProduct,
  // );

  const ticketResponse = await crmService.createTicket({
    description: responseData.textArea_one,
    number: number,
    product: selectedProduct,
    fullName: responseData.textInput_one,
    companyName: responseData.textInput_two,
    mobileNo: responseData.textInput_three,
    email: responseData.textInput_four,
    tallySerialNo: responseData.textInput_five,
    gstNo: responseData.textInput_six,
  });

  if (ticketResponse.status === "success") {
    const case_number = ticketResponse.data.case_number;

    const currentDate = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return celitixService.sendText(
      number,
      `✅ *Support Ticket Generated Successfully!*\n\n` +
        `• *Product:* ${selectedProduct}\n` +
        `• *Ticket ID:* ${case_number}\n` +
        `• *Date:* ${currentDate}\n\n` +
        `Our technical team will get in touch with you shortly.`,
    );
  }

  return celitixService.sendText(
    number,
    "Unable to create ticket. Please try again later.",
  );
}

// handle lead capture flow submission
async function handleLeadCapture(number, responseData) {
  // const name = responseData.name || "";
  // const email = responseData.email || "";

  // const formatLabel = (key) => {
  //   return key
  //     .replace(/_/g, " ")
  //     .replace(/\b\w/g, (char) => char.toUpperCase());
  // };

  // let description = "";

  // Object.entries(responseData).forEach(([key, value]) => {
  //   if (key !== "flow_token") {
  //     const label = formatLabel(key);

  //     description += `${label}: ${value}\n`;
  //   }
  // });

  // let formattedUserDetails = "*User Submitted Details:*\n\n";

  // Object.entries(responseData).forEach(([key, value]) => {
  //   if (key !== "flow_token") {
  //     const label = formatLabel(key);

  //     description += `${label}: ${value}\n`;
  //     // formattedUserDetails += `• *${label}:* ${value}\n`;
  //     formattedUserDetails += `• ${value}\n`;
  //   }
  // });
  const { formattedDetails } = formatFlowData(responseData);

  await celitixService.sendText(number, formattedDetails);

  // await crmService.createLeadNoContactFound(name, email, description, number);
  await crmService.createLeadNoContactFound({
    name: responseData.textInput_one,
    email: responseData.textInput_four,
    description: responseData.textArea_one,
    number: number,
    mobileNo: responseData.textInput_three,
    companyName: responseData.textInput_two,
    tallySerialNo: responseData.textInput_five,
    gstNo: responseData.textInput_six,
  });

  sessionStore.clearSession(number);

  return celitixService.sendText(
    number,
    `✅ Thank you for sharing your details.

Our team has received your request and will reach out to you shortly.`,
  );
}

// handle renewal request flow submission
async function handleRenewalRequest(number, responseData) {
  // const formatLabel = (key) =>
  //   key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // let description = "";
  // let formattedDetails = "*Renewal Request Details:*\n\n";

  // Object.entries(responseData).forEach(([key, value]) => {
  //   if (key !== "flow_token") {
  //     const label = formatLabel(key);

  //     description += `${label}: ${value}\n`;
  //     formattedDetails += `• ${value}\n`;
  //   }
  // });
  const { formattedDetails } = formatFlowData(responseData);

  await celitixService.sendText(number, formattedDetails);

  // const response = await crmService.createTaskFromWhatsapp(number, description);
  const response = await crmService.createTaskFromWhatsapp({
    number: number,
    description: responseData.textArea_one,
    name: responseData.textInput_one,
    email: responseData.textInput_four,
    mobileNo: responseData.textInput_three,
    companyName: responseData.textInput_two,
    tallySerialNo: responseData.textInput_five,
    gstNo: responseData.textInput_six,
  });

  console.log("Renewal Task API:", response);

  sessionStore.clearSession(number);

  return celitixService.sendText(
    number,
    `✅ *Thank you!*

Your renewal request has been successfully submitted.

Our team will review the details and get in touch with you shortly to assist you with the renewal process.`,
  );
}

// handle new requirement flow submission
async function handleNewRequirement(number, session, responseData) {
  const selectedCategory = session.selectedCategory;

  // const formatLabel = (key) =>
  //   key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // let description = "";
  // let formattedDetails = "*Submitted Requirement Details:*\n\n";

  // Object.entries(responseData).forEach(([key, value]) => {
  //   if (key !== "flow_token") {
  //     const label = formatLabel(key);

  //     description += `${label}: ${value}\n`;
  //     formattedDetails += `• ${value}\n`;
  //   }
  // });
  const { formattedDetails } = formatFlowData(responseData);

  await celitixService.sendText(number, formattedDetails);

  // const apiResponse = await crmService.createLeadFromWhatsapp(
  //   number,
  //   selectedCategory,
  //   description,
  // );
  const apiResponse = await crmService.createLeadFromWhatsapp({
    number: number,
    selectedCategory: selectedCategory,
    description: responseData.textArea_one,
    name: responseData.textInput_one,
    email: responseData.textInput_four,
    mobileNo: responseData.textInput_three,
    companyName: responseData.textInput_two,
    tallySerialNo: responseData.textInput_five,
    gstNo: responseData.textInput_six,
  });

  console.log("Create Lead API:", apiResponse);

  sessionStore.clearSession(number);

  return celitixService.sendText(
    number,
    `✅ *Thank you for sharing your requirement.*

Our team has successfully received your request for *${selectedCategory}*.

One of our consultants will review the details and get in touch with you shortly to discuss the next steps.`,
  );
}

// handle other need flow submission
async function handleOtherNeed(number, session, responseData) {
  // const crmService = require("../services/crm.service");
  // const celitixService = require("../services/celitix.service");
  // const sessionStore = require("../utils/session.store");

  // const formatLabel = (key) =>
  //   key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // let description = "Other Need From Whatsapp\n\n";

  // let formattedDetails = "*Submitted Details:*\n\n";

  // Object.entries(responseData).forEach(([key, value]) => {
  //   if (key !== "flow_token") {
  //     const label = formatLabel(key);

  //     description += `${label}: ${value}\n`;

  //     // formattedDetails += `• *${label}:* ${value}\n`;
  //     formattedDetails += `• ${value}\n`;
  //   }
  // });

  const { formattedDetails } = formatFlowData(responseData);

  // show submitted details to user
  await celitixService.sendText(number, formattedDetails);

  // hit CRM API
  // const apiResponse = await crmService.createTaskFromWhatsapp(
  //   number,
  //   description,
  // );
  const apiResponse = await crmService.createTaskFromWhatsapp({
    number: number,
    description: responseData.textArea_one,
    name: responseData.textInput_one,
    email: responseData.textInput_four,
    mobileNo: responseData.textInput_three,
    companyName: responseData.textInput_two,
    tallySerialNo: responseData.textInput_five,
    gstNo: responseData.textInput_six,
  });

  console.log("Other Need Task API:", apiResponse);

  // clear session
  sessionStore.clearSession(number);

  return celitixService.sendText(
    number,
    `✅ *Thank you for contacting Impressive Star.*

Your request has been successfully submitted.

Our team will review the details and get in touch with you shortly to assist you further.`,
  );
}
