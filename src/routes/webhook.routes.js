const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook.controller");

router.post("/supportbot", webhookController.handleIncoming);

const celitixService = require("../services/celitix.service");

router.post("/test-send", async (req, res) => {
  try {
    // send text message
    const { to, message } = req.body;
    const response = await celitixService.sendText(to, message);

    // send list message
    // const { to, header, bodyText, buttonText, sections } = req.body;
    // const response = await celitixService.sendListMessage(
    //   to,
    //   header,
    //   bodyText,
    //   buttonText,
    //   sections,
    // );

    // send button message
    // const { to, header, bodyText, footerText, buttons } = req.body;
    // const response = await celitixService.sendButtonMessage(
    //   to,
    //   header,
    //   bodyText,
    //   footerText,
    //   buttons,
    // );

    // send cta url message
    // const { to, header, bodyText, displayText, url, footerText } = req.body;

    // const response = await celitixService.sendCtaUrlButtonMessage(
    //   to,
    //   header,
    //   bodyText,
    //   displayText,
    //   url,
    //   footerText,
    // );

    // send template message
    // const { to, templateName, languageCode, bodyParams, headerMedia } =
    //   req.body;

    // const response = await celitixService.sendTemplateMessage(
    //   to,
    //   templateName,
    //   languageCode,
    //   bodyParams,
    //   headerMedia,
    // );

    console.log("Sent to:", to);

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;
