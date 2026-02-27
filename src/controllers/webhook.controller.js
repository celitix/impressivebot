const mainFlow = require("../flows/main.flow");
const flowHandler = require("../flows/flow.handler");

exports.handleIncoming = async (req, res) => {
  try {
    console.log("Incoming Webhook:");
    console.log(JSON.stringify(req.body, null, 2));

    const body = req.body;

    if (!body.entry) {
      return res.sendStatus(200);
    }

    const change = body.entry?.[0]?.changes?.[0];
    const value = change?.value;

    if (!value) {
      return res.sendStatus(200);
    }

    const message = value.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }
    console.log("Full message object:", message);

    const from = message.from;
    const type = message.type;

    console.log("From:", from);
    console.log("Type:", type);

    // TEXT MESSAGE
    if (type === "text") {
      const text = message.text?.body;
      console.log("Text:", text);

      await mainFlow.handleText(from, text);
    }

    // INTERACTIVE LIST REPLY
    // if (type === "interactive") {
    //   const listReplyId = message.interactive?.list_reply?.id;
    //   const buttonReplyId = message.interactive?.button_reply?.id;

    //   if (listReplyId) {
    //     await mainFlow.handleList(from, listReplyId);
    //   }

    //   if (buttonReplyId) {
    //     await mainFlow.handleButton(from, buttonReplyId);
    //   }
    // }

    if (type === "interactive") {
      const interactiveType = message.interactive?.type;

      console.log("Interactive Type:", interactiveType);

      // 🔥 FLOW SUBMISSION HANDLER
      if (interactiveType === "nfm_reply") {
        console.log("Flow Response Received");

        await flowHandler.handleFlowResponse(
          from,
          message.interactive.nfm_reply,
        );

        return res.sendStatus(200);
      }

      // LIST REPLY
      if (interactiveType === "list_reply") {
        const listReplyId = message.interactive?.list_reply?.id;
        console.log("List Clicked:", listReplyId);

        await mainFlow.handleList(from, listReplyId);
        return res.sendStatus(200);
      }

      // BUTTON REPLY
      if (interactiveType === "button_reply") {
        const buttonReplyId = message.interactive?.button_reply?.id;
        console.log("Button Clicked:", buttonReplyId);

        if (mainFlow.handleButton) {
          await mainFlow.handleButton(from, buttonReplyId);
        }

        return res.sendStatus(200);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook Error:", error);
    res.sendStatus(500);
  }
};
