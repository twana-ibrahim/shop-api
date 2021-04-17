const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const ProductsController = require("../controllers/products");

// to get all products
router.get("/", checkAuth, ProductsController.products_get_all);

// to post new product
router.post("/", checkAuth, ProductsController.products_create_a_product);

// to get a specific product
router.get("/:productId", checkAuth, ProductsController.products_get_a_product);

// to update a specific product
router.put(
  "/:productId",
  checkAuth,
  ProductsController.products_update_a_product
);

// to delete a specific product
router.delete("/:productId", ProductsController.products_delete_a_product);

module.exports = router;
