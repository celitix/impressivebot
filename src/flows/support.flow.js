const celitixService = require("../services/celitix.service");
const crmService = require("../services/crm.service");
const sessionStore = require("../utils/session.store");

exports.startSupport = async (number) => {
  await celitixService.sendText(
    number,
    `You've selected Technical Issue.
Let me just search the active products & services in associated accounts.`,
  );

  return checkProducts(number);
};

async function checkProducts(number) {
  try {
    const response = await crmService.getProductDetails(number);

    console.log("📦 Product API:", response);

    if (response.status === "success" && response.data?.length > 0) {
      const productsObj = response.data[0];

      const products = Object.values(productsObj).filter(Boolean);

      // store in session
      const session = sessionStore.getSession(number);
      session.products = products;
      sessionStore.setSession(number, session);

      const rows = products.map((product, index) => ({
        id: `product_${index + 1}`,
        title: product.substring(0, 24),
        description: product,
      }));

      return celitixService.sendListMessage(
        number,
        "Support Products",
        "Please tell us which product you need support for:",
        "View Products",
        [
          {
            title: "Available Products",
            rows: [
              ...rows,
              {
                id: "product_other",
                title: "Item Not Listed",
                description: "My product is not listed here",
              },
            ],
          },
        ],
      );
    }

    return celitixService.sendText(
      number,
      "No active products found for your account. Please contact support.",
    );
  } catch (error) {
    console.error("Product Error:", error.message);

    return celitixService.sendText(
      number,
      "Unable to fetch product details right now.",
    );
  }
}

// generate ticket direct
// exports.handleProductSelection = async (number, productId) => {
//   const session = sessionStore.getSession(number);
//   const products = session.products || [];

//   if (productId === "product_other") {
//     return celitixService.sendText(
//       number,
//       "Please describe your product and issue.",
//     );
//   }

//   const productIndex =
//     parseInt(productId.replace("product_", "").replace("product", "")) - 1;
//   const selectedProduct = products[productIndex];

//   if (!selectedProduct) {
//     return celitixService.sendText(number, "Invalid product selection.");
//   }

//   try {
//     const ticket = await crmService.createTicket(
//       "Technical issue from WhatsApp",
//       number,
//       selectedProduct,
//     );

//     await celitixService.sendText(
//       number,
//       `Support ticket for ${selectedProduct} is generated successfully.
// Our team will be in touch shortly.`,
//     );
//   } catch (error) {
//     await celitixService.sendText(
//       number,
//       "Unable to generate ticket at the moment.",
//     );
//   }
// };

// generate ticket with user flow submission

exports.handleProductSelection = async (number, productId) => {
  const session = sessionStore.getSession(number);
  const products = session.products || [];

  const productIndex =
    parseInt(productId.replace("product_", "").replace("product", "")) - 1;
  const selectedProduct = products[productIndex];

  if (!selectedProduct) {
    return celitixService.sendText(number, "Invalid product selection.");
  }

  // store selected product in session
  session.selectedProduct = selectedProduct;
  await celitixService.sendText(
    number,
    `Found following products & contracts for ${selectedProduct}.`,
  );

  // 🔥 SEND FLOW INSTEAD OF CREATING TICKET
  return celitixService.sendFlowMessage(
    number,
    "Support Form",
    "Please fill in the support details.",
    "Impressive Star Support",
    "navigate",
    "2144483762964142", // hardcode for now
    "Open Form",
    "WELCOME",
  );
};
