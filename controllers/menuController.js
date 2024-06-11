import db from "../db/database.js";

// Add item to menu as admin
const addItemMenu = async (req, res) => {
  // Checks if the request body is an array or a single object
  const updatedItems = Array.isArray(req.body) ? req.body : [req.body];

  // Loops throught the request body to check if there are any empty fields
  for (let item of updatedItems) {
    const { _id, title, desc, price } = item;
    if (!_id || !title || !desc || !price) {
      return res.status(400).json({
        error: "The product must contain _ID, TITLE, DESC and PRICE",
      });
    }
  }

  try {
    const existingMenu = await db["menu"].findOne({ _id: "menu" });

    // Check if product already exists in the menu
    const existingItems = existingMenu.items;
    // Loops through the existing items in the menu to check if the product already exists
    for (let newItem of updatedItems) {
      if (existingItems.some((item) => item._id === newItem._id)) {
        return res.status(400).json({
          Message: `Product with ID: ${newItem._id} already exists in the menu`,
        });
      }
    }

    // Add createdAt to the new product
    const timestamp = new Date();
    updatedItems.forEach((item) => {
      item.createdAt = timestamp.toISOString();
    });

    // Adds the new product to the menu
    existingMenu.items.push(...updatedItems);

    // Updates the menu in the database
    await db["menu"].update({ _id: "menu" }, existingMenu);

    // Returns a sucess message with the new products and the updated menu
    return res.status(200).json({
      Success: "One or more produts have been added to the menu",
      Products: updatedItems,
      Menu: existingMenu,
    });
  } catch (err) {
    return res.status(500).send({
      Message: "An error has occurred",
      error: err.message,
    });
  }
};

// Modify item in menu as admin
const modifyItem = async (req, res) => {
  const { productId } = req.params;

  // Convert productId to a number
  const productIdNumber = Number(productId);

  // Checks if the request body is an array or a single object
  const modifiedItem = req.body;

  // Loops throught the request body to check if there are any empty fields
  const { _id, title, desc, price } = modifiedItem;
  if (!_id || !title || !desc || !price) {
    return res.status(400).json({
      error: "The product must contain _ID, TITLE, DESC and PRICE",
    });
  }

  try {
    const existingMenu = await db["menu"].findOne({ _id: "menu" });
    if (!existingMenu) {
      return res.status(404).json({
        Message: "Menu not found",
      });
    }

    // Check if the product exists in the menu
    const existingItems = existingMenu.items;
    const index = existingItems.findIndex(
      (item) => item._id === productIdNumber
    );
    if (index === -1) {
      return res.status(400).json({
        Message: `The product with ID ${productIdNumber} does not exist in the menu`,
      });
    }

    // Add modifiedAt to the modified product
    modifiedItem.modifiedAt = new Date().toISOString();
    existingItems[index] = { ...existingItems[index], ...modifiedItem };

    // Update the menu with modified products
    await db["menu"].update(
      { _id: "menu" },
      { $set: { items: existingItems } }
    );

    return res.status(200).json({
      Message: "Products updated in the menu",
      Product: existingItems[index],
    });
  } catch (error) {
    return res.status(500).send({
      Message: "An error has occurred",
      error: error.message,
    });
  }
};

// Remove item from menu as admin
const removeProduct = async (req, res) => {
  const { productId } = req.params;

  // Convert productId to a number
  const productIdNumber = Number(productId);

  try {
    const existingMenu = await db["menu"].findOne({ _id: "menu" });
    if (!existingMenu) {
      return res.status(404).json({
        Message: "Menu not found",
      });
    }

    // Check if the product exists in the menu
    const existingItems = existingMenu.items;
    const index = existingItems.findIndex(
      (item) => item._id === productIdNumber
    );

    if (index === -1) {
      return res.status(400).json({
        Message: `The product with ID ${productIdNumber} does not exist in the menu`,
      });
    }

    // Removes the product from menu
    const removedProduct = existingItems.splice(index, 1)[0];

    await db["menu"].update(
      { _id: "menu" },
      { $set: { items: existingItems } }
    );

    return res.status(200).json({
      Message: `Product with ID: ${productIdNumber} has been deleted.`,
      Product: removedProduct,
    });
  } catch (error) {
    return res.status(500).send({
      Message: "An error has occurred",
      Error: error.message,
    });
  }
};

// Add promotional offer
const createOffers = async (req, res) => {
  // Checks if the request body is an array or a single object
  const newOffer = Array.isArray(req.body) ? req.body : [req.body];

  // Loops throught the request body to check if there are any empty fields
  for (let offer of newOffer) {
    const { products, price } = offer;

    // Check if offer has the required fields
    if (!products || !Array.isArray(products) || !price) {
      return res.status(400).json({
        Error: "The offer must contain PRODUCTS and PRICE",
      });
    }

    // Check if the products have the required fields
    for (let product of products) {
      const { _id, title, desc } = product;
      if (!_id || !title || !desc) {
        return res.status(400).json({
          Error: "Each product must contain _ID, TITLE and DESC",
        });
      }
    }
  }

  try {
    const existingMenu = await db["menu"].findOne({ _id: "menu" });

    // Checks if the products exists in the menu
    for (let offer of newOffer) {
      for (let product of offer.products) {
        const menuProduct = existingMenu.items.find(
          (item) => item._id === product._id
        );
        if (!menuProduct) {
          return res.status(400).json({
            Error: `The product with _id ${product._id} must match the products in the menu`,
          });
        }
      }
    }

    // Adds the offer to the menu database
    await db["menu"].update(
      { _id: "menu" },
      {
        $push: { offers: { $each: newOffer } },
      }
    );

    return res.status(201).json({
      Message: "Offer added successfully!",
      newOffer,
    });
  } catch (error) {
    return res.status(500).send({
      Message: "An error has occurred",
      Error: error.message,
    });
  }
};

export { addItemMenu, modifyItem, removeProduct, createOffers };
