const client = require("../middleware/shopifyMiddleware");

exports.getOrdersCount = async (req, res) => {
  try {
    const response = await client.get("orders/count", {
      searchParams: { status: "any" },
    });

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ count: body.count });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const response = await client.get("orders", {
      searchParams: { status: "any" },
    });

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ orders: body.orders });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderInfo = async (req, res) => {
  try {
    const response = await client.get("orders/" + req.params.id, {
      searchParams: { status: "any" },
    });

    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ order: body.order });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.createOrder = async (req, res) => {
//   try {
//     const response = await client.post("orders", {
//       data: {
//         product: {
//           title: req.body.title,
//         },
//       },
//     });

//     if (response.ok) {
//       const body = await response.json();
//       res.status(200).json({ message: "this new orders is created", body });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.updateOrder = async (req, res) => {
  try {
    const response = await client.put("orders/" + req.params.id, {
      data: {
        order:req.body
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

exports.deleteOrder = async (req, res) => {
  try {
    const response = await client.delete("orders/" + req.params.id);
    if (response.ok) {
      const body = await response.json();
      res.status(200).json({ message: "this order is deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
