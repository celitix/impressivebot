const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.CELITIX_BASE_URL;
const API_KEY = process.env.CELITIX_API_KEY;
const WABA_NUMBER = process.env.CELITIX_WABA_NUMBER;

exports.sendText = async (to, message) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/wrapper/waba/message`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
          preview_url: true,
          body: message,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          key: API_KEY,
          wabaNumber: WABA_NUMBER,
        },
      },
    );

    console.log("Message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Celitix Send Error:", error.response?.data || error.message);
    throw error;
  }
};

exports.sendListMessage = async (
  to,
  header,
  bodyText,
  buttonText,
  sections,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/wrapper/waba/message`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: header,
          },
          body: {
            text: bodyText,
          },
          action: {
            button: buttonText,
            sections: sections,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          key: API_KEY,
          wabaNumber: WABA_NUMBER,
        },
      },
    );

    console.log("📋 List Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Celitix List Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

exports.sendFlowMessage = async (
  to,
  headerText,
  bodyText,
  footerText,
  flowAction,
  flowId,
  flowCta,
  screen,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/wrapper/waba/message`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "interactive",
        interactive: {
          type: "flow",
          header: {
            type: "text",
            text: headerText,
          },
          body: {
            text: bodyText,
          },
          footer: {
            text: footerText,
          },
          action: {
            name: "flow",
            parameters: {
              flow_message_version: "3",
              flow_action: flowAction,
              flow_token: "test",
              flow_id: flowId,
              flow_cta: flowCta,
              flow_action_payload: {
                screen: screen,
              },
            },
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          key: API_KEY,
          wabaNumber: WABA_NUMBER,
        },
      },
    );

    console.log("Flow Message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Celitix Flow Error:", error.response?.data || error.message);
    throw error;
  }
};
