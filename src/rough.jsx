async function handleSupportTicket(number, session, responseData) {
  const selectedProduct = session.selectedProduct;

  if (!selectedProduct) {
    return celitixService.sendText(
      number,
      "Session expired. Please start again.",
    );
  }

  const { description, formattedDetails } = formatFlowData(responseData);

  await celitixService.sendText(number, formattedDetails);

  const ticketResponse = await crmService.createTicket(
    description,
    number,
    selectedProduct,
  );

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

  return celitixService.sendText(number, "Unable to create ticket.");
}