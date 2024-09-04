const client = require("../middleware/shopifyMiddleware");

exports.getProductCount = async (req, res) => {
  try {
    const response = await client.get("products/count");
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ count: body.count });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to get products count " + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.getLocations = async (req, res) => {
  try {
    const response = await client.get("locations");
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ body });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to get Locations count " + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.getAllProducts = async (req, res) => {
  try {
    const response = await client.get("products");

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ products: body.products });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to get all products " + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.getAllInventoryLevel = async (req, res) => {
  try {
    const response = await client.get(
      "inventory_levels?location_ids=" + req.params.id
    );

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ inventory_levels: body.inventory_levels });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to get all Levels " + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.getProductInfo = async (req, res) => {
  try {
    const response = await client.get("products/" + req.params.id);
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ products: body.product });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to get product info " + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.createProduct = async (req, res) => {
  try {
    const response = await client.post("products", {
      data: {
        product: req.body,
      },
    });

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ message: "this new product is created", body });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to create product" + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.updateProduct = async (req, res) => {
  try {
    const response = await client.put("products/" + req.params.id, {
      data: {
        product: req.body,
      },
    });

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ body });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to update product " + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.setItemLevel = async (req, res) => {
  try {
    const response = await client.post("inventory_levels/set", {
      data: req.body,
    });

    if (response.ok) {
      const body = await response.json();
      res
        .status(200)
        .json({ message: "Item quantity level has been changed", body });
    } else {
      const errorBody = await response.json();
      res.status(response.status).json({ message:"Failed to set product's quantity: " + errorBody.errors });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addVariant = async (req, res) => {
  try {
    const response = await client.post(
      "products/" + req.params.id + "/variants",
      {
        data: {
          variant: req.body,
        },
      }
    );

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ body });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to create variant " + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.updateVariant = async (req, res) => {
  try {
    const response = await client.put(
      "products/" + req.params.id + "/variants/" + req.params.variant,
      {
        data: {
          variant: req.body,
        },
      }
    );

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ body });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to update variant " + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.deleteProduct = async (req, res) => {
  try {
    const response = await client.delete("products/" + req.params.id);
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ message: "this product is deleted" });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to delete product" + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};

exports.deleteVariant = async (req, res) => {
  try {
    const response = await client.delete(
      "products/" + req.params.id + "/variants/" + req.params.variant
    );
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ message: "this product's variant is deleted" });
    } else {
      const errorBody = await response.json();
      res
        .status(response.status)
        .json({ error: "Failed to delete variant " + errorBody });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};
