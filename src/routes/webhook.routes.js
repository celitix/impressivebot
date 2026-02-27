const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook.controller");

router.post("/celitix", webhookController.handleIncoming);

const celitixService = require("../services/celitix.service");

router.post("/test-send", async (req, res) => {
  try {
    const { to, message } = req.body;

    const response = await celitixService.sendText(to, message);

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
