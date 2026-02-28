const crmService = require("../services/crm.service");
const celitixService = require("../services/celitix.service");
const sessionStore = require("../utils/session.store");

exports.handleFlowResponse = async (number, flowReply) => {
  try {
    const session = sessionStore.getSession(number);

    const responseData = JSON.parse(flowReply.response_json);
    console.log(responseData);

    // responseData contains dynamic keys
    // example:
    // {
    //   flow_token: "...",
    //   first_name: "...",
    //   last_name: "...",
    //   issue: "..."
    // }

    const selectedProduct = session.selectedProduct;
    console.log(selectedProduct);

    if (!selectedProduct) {
      return celitixService.sendText(
        number,
        "Session expired. Please start again.",
      );
    }
    const formatLabel = (key) => {
      return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    let description = "";
    let formattedUserDetails = "*User Submitted Details:*\n\n";

    Object.entries(responseData).forEach(([key, value]) => {
      if (key !== "flow_token") {
        const label = formatLabel(key);

        description += `${label}: ${value}\n`;
        // formattedUserDetails += `• *${label}:* ${value}\n`;
        formattedUserDetails += `• ${value}\n`;
      }
    });
    await celitixService.sendText(number, formattedUserDetails);
    console.log(description);
    console.log(number);

    // return

    const ticketResponse = await crmService.createTicket(
      description,
      number,
      selectedProduct,
    );

    if (ticketResponse.status === "success") {
      const caseId = ticketResponse.data.case_id;
      const case_number = ticketResponse.data.case_number;

      const currentDate = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      return celitixService.sendText(
        number,
        `✅ *Support Ticket Generated Successfully!*\n\n` +
          `• *Product:* ${selectedProduct}\n` +
          // `• *Ticket ID:* ${caseId}\n` +
          `• *Ticket ID:* ${case_number}\n` +
          `• *Date:* ${currentDate}\n\n` +
          `Our technical team will get in touch with you shortly.`,
      );

//       return celitixService.sendText(
//         number,
//         `Support ticket for ${selectedProduct} is generated successfully. Our team will be in touch
// shortly`,
//       );

      //       return celitixService.sendText(
      //         number,
      //         `✅ Your support ticket has been successfully generated!
      // Ticket ID: ${caseId} Date:
      // Thank you for reaching out! Our technical team will get in touch with you shortly. Please
      // stay connected.`,
      //       );
    }

    return celitixService.sendText(
      number,
      "Unable to create ticket. Please try again later.",
    );

    // return celitixService.sendText(number, "Unable to create ticket.");
  } catch (error) {
    console.error("Flow Error:", error.message);
    return celitixService.sendText(number, "Something went wrong.");
  }
};
