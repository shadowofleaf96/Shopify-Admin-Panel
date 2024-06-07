const client = require("../middleware/shopifyMiddleware");

exports.getProductCount = async (req, res) => {
  try {
    const response = await client.get("products/count");
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ count: body.count });
    } else {
      res.status(response.status).json({ error: "Failed to get products count" });
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
      res.status(response.status).json({ error: "Failed to get all products" });
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
      res.status(response.status).json({ error: "Failed to get product info" });
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
      res.status(response.status).json({ error: "Failed to create product" });
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
      res.status(response.status).json({ error: "Failed to update product" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
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
      res.status(response.status).json({ error: "Failed to create variant" });
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
      res.status(response.status).json({ error: "Failed to update variant" });
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
      res.status(response.status).json({ error: "Failed to delete product" });
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
      res.status(response.status).json({ error: "Failed to delete variant" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.end();
};
