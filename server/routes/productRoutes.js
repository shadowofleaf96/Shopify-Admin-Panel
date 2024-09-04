const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.get("/count", productController.getProductCount);
router.get("/getlocations", productController.getLocations);
router.get("/getlevels/:id", productController.getAllInventoryLevel);
router.get("/:id", productController.getProductInfo);
router.get("/", productController.getAllProducts);
router.post("/:id/variants", productController.addVariant);
router.post("/setlevels", productController.setItemLevel);
router.put("/:id/variants/:variant", productController.updateVariant);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.delete("/:id/variants/:variant", productController.deleteVariant);

module.exports = router;
