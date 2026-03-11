const celitixService = require("../services/celitix.service");
const crmService = require("../services/crm.service");
const sessionStore = require("../utils/session.store");

exports.startNewRequirement = async (number) => {
  try {
    await celitixService.sendText(
      number,
      `Thank you for your interest in exploring new solutions with *Impressive Star*.

To help us understand your requirements better, please select the relevant product or service category from the list below. Our team will review your request and connect with you shortly.`,
    );

    const response = await crmService.getProductCategory(number);

    console.log("Product Category API:", response);

    if (response.status !== "success") {
      return celitixService.sendText(
        number,
        "Unable to fetch product categories at the moment.",
      );
    }

    const categoriesObj = response.data?.[0];

    if (!categoriesObj) {
      return celitixService.sendText(number, "No product categories found.");
    }

    const categories = Object.values(categoriesObj).filter(Boolean);

    console.log("CATEGORIES:", categories);

    const session = sessionStore.getSession(number);
    session.categories = categories;
    sessionStore.setSession(number, session);

    // const rows = categories.map((cat, index) => ({
    //   id: `category_${index + 1}`,
    //   title: cat.substring(0, 24),
    //   description: cat,
    // }));

    const rows = categories.slice(0, 10).map((cat, index) => ({
      id: `category_${index + 1}`,
      title: cat.length > 20 ? cat.substring(0, 20) + "..." : cat,
      description: cat,
    }));

    const sections = [
      {
        title: "Available Categories",
        rows,
      },
    ];

    console.log("LIST SECTIONS:", JSON.stringify(sections, null, 2));

    return celitixService.sendListMessage(
      number,
      "Product Categories",
      "Please choose the category that best matches your requirement:",
      "View Categories",
      sections,
    );
    // return celitixService.sendListMessage(
    //   number,
    //   "Test",
    //   "Choose option",
    //   "Open",
    //   [
    //     {
    //       title: "Test",
    //       rows: [
    //         { id: "1", title: "Option 1" },
    //         { id: "2", title: "Option 2" },
    //       ],
    //     },
    //   ],
    // );
  } catch (error) {
    console.error("Category Error:", error.message);

    return celitixService.sendText(
      number,
      "Something went wrong while fetching categories.",
    );
  }
};

exports.handleCategorySelection = async (number, categoryId) => {
  const session = sessionStore.getSession(number);
  const categories = session.categories || [];

  const index = parseInt(categoryId.replace("category_", "")) - 1;

  const selectedCategory = categories[index];

  if (!selectedCategory) {
    return celitixService.sendText(number, "Invalid category selection.");
  }

  session.selectedCategory = selectedCategory;
  session.flowType = "new_requirement";

  sessionStore.setSession(number, session);

  await celitixService.sendText(
    number,
    `You selected *${selectedCategory}*.

Please provide a few details about your requirement so our team can assist you better.`,
  );

  return celitixService.sendFlowMessage(
    number,
    "New Requirement Form",
    "Please share your requirement details.",
    "Impressive Star",
    "navigate",
    "2144483762964142",
    "Open Form",
    "WELCOME",
  );
};
