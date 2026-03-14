const axios = require("axios");
require("dotenv").config();

const BASE_URL = process.env.CRM_BASE_URL;
const COOKIE = process.env.CRM_COOKIE;

// 919737274363
exports.getNumberDetails = async (number) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getNumberDetails&number=919737274363`,
    {},
    { headers: { Cookie: COOKIE } },
  );

  return response.data;
};

// get product details for the number
// exports.getNumberDetails = async (number) => {
//   const response = await axios.post(
//     `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getNumberDetails&number=${number}`,
//     {},
//     { headers: { Cookie: COOKIE } },
//   );

//   return response.data;
// };

// get product details with number as param
exports.getProductDetails = async (number) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=getProductDetails&number=${number}`,
    {},
    { headers: { Cookie: COOKIE } },
  );

  return response.data;
};

// create ticket with description, number, product
exports.createTicket = async (
  description,
  number,
  product,
  fullName,
  companyName,
  mobileNo,
  email,
  tallySerialNo,
  gstNo,
) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=createTicket`,
    {},
    {
      params: {
        description,
        number,
        product,
        fullName,
        companyName,
        mobileNo,
        email,
        tallySerialNo,
        gstNo,
      },
      headers: { Cookie: COOKIE },
    },
  );

  return response.data;
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

// create lead when no contact found with name, email, description, number
exports.createLeadNoContactFound = async (
  name,
  email,
  description,
  number,
  mobileNo,
  companyName,
  tallySerialNo,
  gstNo,
) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=CreateLeadFromNoContactFound&name=${name}&email=${email}&description=${description}&number=${number}&mobileNo=${mobileNo}&companyName=${companyName}&tallySerialNo=${tallySerialNo}&gstNo=${gstNo}`,
    {},
    {
      params: { name, email, description, number },
      headers: { Cookie: COOKIE },
    },
  );

  return response.data;
};

// create task from whatsapp with number and description
exports.createTaskFromWhatsapp = async (
  number,
  description,
  name,
  email,
  mobileNo,
  companyName,
  tallySerialNo,
  gstNo,
) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=createTaskFromWhatsapp&number=${number}&description=${description}&name=${name}&email=${email}mobileNo=${mobileNo}&companyName=${companyName}&tallySerialNo=${tallySerialNo}&gstNo=${gstNo}`,
    {},
    {
      params: { number, description },
      headers: { Cookie: COOKIE },
    },
  );

  return response.data;
};

// create lead from whatsapp with number and product category
exports.createLeadFromWhatsapp = async (
  number,
  product_category,
  description,
  name,
  email,
  mobileNo,
  companyName,
  tallySerialNo,
  gstNo,
) => {
  const response = await axios.post(
    `${BASE_URL}?entryPoint=DT_Whatsapp_From_Boat&eventType=createLeadFromWhatsapp`,
    {},
    {
      params: {
        number,
        product_category,
        description,
        name,
        email,
        mobileNo,
        companyName,
        tallySerialNo,
        gstNo,
      },
      headers: { Cookie: COOKIE },
    },
  );

  return response.data;
};
