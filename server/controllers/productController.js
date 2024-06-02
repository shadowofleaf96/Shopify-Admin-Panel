const client = require("../middleware/shopifyMiddleware");

exports.getProductCount = async (req, res) => {
  try {
    const response = await client.get("products/count");
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ count: body.count });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const response = await client.get("products");

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ products: body.products });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductInfo = async (req, res) => {
  try {
    const response = await client.get("products/" + req.params.id);
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ products: body.product });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const response = await client.post("products", {
      data: {
        product: {
          product: req.body,
        },
      },
    });

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ message: "this new product is created", body });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const response = await client.delete("products/" + req.params.id);
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ message: "this product is deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const response = await client.delete("products/" + req.params.id + "/variants/" + req.params.variant);
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ message: "this product's variant is deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
