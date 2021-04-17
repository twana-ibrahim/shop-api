const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const OrdersController = require("../controllers/orders");

// to get all orders
router.get("/", checkAuth, OrdersController.orders_get_all);

// to post new order
router.post("/", checkAuth, OrdersController.orders_create_order);

// to get a specific order
router.get("/:orderId", checkAuth, OrdersController.orders_get_an_order);

// to delete a specific order
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_an_order);

module.exports = router;
