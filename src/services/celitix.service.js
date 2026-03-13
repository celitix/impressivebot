const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.CELITIX_BASE_URL;
const API_KEY = process.env.CELITIX_API_KEY;
const WABA_NUMBER = process.env.CELITIX_WABA_NUMBER;
const PHONE_NUMBER_ID = process.env.CELITIX_PHONE_NUMBER_ID;
const DISPLAY_NUMBER = process.env.CELITIX_DISPLAY_NUMBER;

console.log("Sending message using Base URL:", BASE_URL);
console.log("Sending message using API KEY:", API_KEY);
console.log("Sending from WABA:", WABA_NUMBER);
console.log("Sending from Phone Number ID:", PHONE_NUMBER_ID);
console.log("Sending from Display Number:", DISPLAY_NUMBER);

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

exports.sendButtonMessage = async (
  to,
  header,
  bodyText,
  footerText,
  buttons,
) => {
  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: bodyText,
        },
        footer: {
          text: footerText,
        },
        action: {
          buttons: buttons,
        },
      },
    };

    // add header only if provided
    if (header) {
      payload.interactive.header = header;
    }

    const response = await axios.post(
      `${BASE_URL}/wrapper/waba/message`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          key: API_KEY,
          wabaNumber: WABA_NUMBER,
        },
      },
    );

    console.log("Button Message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Celitix Button Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

exports.sendCtaUrlButtonMessage = async (
  to,
  header,
  bodyText,
  displayText,
  url,
  footerText,
) => {
  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "cta_url",
        body: {
          text: bodyText,
        },
        action: {
          name: "cta_url",
          parameters: {
            display_text: displayText,
            url: url,
          },
        },
      },
    };

    // dynamically add header
    if (header) {
      payload.interactive.header = header;
    }

    // dynamically add footer
    if (footerText) {
      payload.interactive.footer = {
        text: footerText,
      };
    }

    const response = await axios.post(
      `${BASE_URL}/wrapper/waba/message`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          key: API_KEY,
          wabaNumber: WABA_NUMBER,
        },
      },
    );

    console.log("CTA URL Button Message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Celitix CTA URL Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

exports.sendTemplateMessage = async (
  to,
  templateName,
  languageCode,
  bodyParams = [],
  headerMedia = null,
) => {
  try {
    // Convert body positional params
    const bodyParameters = bodyParams.map((value) => ({
      type: "text",
      text: value,
    }));

    const components = [];

    // Add header media if provided
    if (headerMedia) {
      components.push({
        type: "header",
        parameters: [headerMedia],
      });
    }

    // Add body parameters
    components.push({
      type: "body",
      parameters: bodyParameters,
    });

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components: components,
      },
    };

    const response = await axios.post(
      `${BASE_URL}/wrapper/waba/message`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          key: API_KEY,
          wabaNumber: WABA_NUMBER,
        },
      },
    );

    console.log("Template Message Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Template Message Error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
