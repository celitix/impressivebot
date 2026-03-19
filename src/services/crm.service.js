const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.CRM_BASE_URL;
const COOKIE = process.env.CRM_COOKIE;

// 919737274363
// exports.getNumberDetails = async (number) => {
//   const response = await axios.post(
//     `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getNumberDetails&number=919737274363`,
//     {},
//     { headers: { Cookie: COOKIE } },
//   );

//   return response.data;
// };

// get product details for the number
exports.getNumberDetails = async (number) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getNumberDetails&number=${number}`,
    {},
    { headers: { Cookie: COOKIE } },
  );

  return response.data;
};

// get product details with number as param
exports.getProductDetails = async (number) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getProductDetails&number=${number}`,
    {},
    { headers: { Cookie: COOKIE } },
  );

  return response.data;
};

// create ticket
exports.createTicket = async (ticketData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}`,
      {},
      {
        params: {
          entryPoint: "DT_Whatsapp_From_Boat",
          eventType: "createTicket",
          ...ticketData,
        },
        headers: { Cookie: COOKIE },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error.message);
    throw error;
  }
};

// get product category with number as param
exports.getProductCategory = async (number) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getProductCategory&number=${number}`,
    {},
    {
      headers: { Cookie: COOKIE },
      params: { number },
    },
  );

  return response.data;
};

// create lead when no contact found
exports.createLeadNoContactFound = async (leadData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}`,
      {},
      {
        params: {
          entryPoint: "DT_Whatsapp_From_Boat",
          eventType: "CreateLeadFromNoContactFound",
          ...leadData,
        },
        headers: { Cookie: COOKIE },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error creating lead:", error.message);
    throw error;
  }
};

// create task from whatsapp
exports.createTaskFromWhatsapp = async (taskData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}`,
      {},
      {
        params: {
          entryPoint: "DT_Whatsapp_From_Boat",
          eventType: "createTaskFromWhatsapp",
          ...taskData,
        },
        headers: { Cookie: COOKIE },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error creating renewal task:", error.message);
    throw error;
  }
};

// create lead from whatsapp with number and product category
exports.createLeadFromWhatsapp = async (leadData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}`,
      {},
      {
        params: {
          entryPoint: "DT_Whatsapp_From_Boat",
          eventType: "createLeadFromWhatsapp",
          ...leadData,
        },
        headers: { Cookie: COOKIE },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error creating lead from WhatsApp:", error.message);
    throw error;
  }
};
