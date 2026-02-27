const crmService = require("../services/crm.service");
const celitixService = require("../services/celitix.service");
const sessionStore = require("../utils/session.store");

exports.handleFlowResponse = async (number, flowReply) => {
  try {
    const session = sessionStore.getSession(number);

    const responseData = JSON.parse(flowReply.response_json);
    console.log(responseData)

    // responseData contains dynamic keys
    // example:
    // {
    //   flow_token: "...",
    //   first_name: "...",
    //   last_name: "...",
    //   issue: "..."
    // }

    const selectedProduct = session.selectedProduct;
    console.log(selectedProduct)

    if (!selectedProduct) {
      return celitixService.sendText(
        number,
        "Session expired. Please start again.",
      );
    }

    let description = "";

    Object.entries(responseData).forEach(([key, value]) => {
      if (key !== "flow_token") {
        description += `${key}: ${value}\n`;
      }
    });
    console.log(description)
    console.log(number)

    const ticketResponse = await crmService.createTicket(
      description,
      number,
      selectedProduct,
    );

    if (ticketResponse.status === "success") {
      const caseId = ticketResponse.data.case_id;

      return celitixService.sendText(
        number,
        `✅ Ticket Created Successfully!
Ticket ID: ${caseId}
Our team will contact you shortly. description ${description}, selected product ${selectedProduct} `,
      );
    }

    return celitixService.sendText(number, "Unable to create ticket.");
  } catch (error) {
    console.error("Flow Error:", error.message);
    return celitixService.sendText(number, "Something went wrong.");
  }
};
