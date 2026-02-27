const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.CRM_BASE_URL;
const COOKIE = process.env.CRM_COOKIE;

exports.getNumberDetails = async (number) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getNumberDetails&number=919737274363`,
    {},
    { headers: { Cookie: COOKIE } },
  );

  return response.data;
};
// exports.getNumberDetails = async (number) => {
//   const response = await axios.post(
//     `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getNumberDetails&number=${number}`,
//     {},
//     { headers: { Cookie: COOKIE } },
//   );

//   return response.data;
// };

exports.getProductDetails = async (number) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getProductDetails&number=${number}`,
    {},
    { headers: { Cookie: COOKIE } },
  );

  return response.data;
};

exports.createTicket = async (description, number, product) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=createTicket`,
    {},
    {
      params: { description, number, product },
      headers: { Cookie: COOKIE },
    },
  );

  return response.data;
};
