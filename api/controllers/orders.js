const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.orders_get_all = (req, res, next) => {
  // select use to choose the properties to display
  // populate use to get more data for example here get name and display
  Order.find()
    .select("_id product quantity")
    .populate("product", "name")
    .exec()
    .then((orders) => {
      const response = {
        success: true,
        count: orders.length,
        orders: orders.map((order) => {
          return {
            _id: order._id,
            product: order.product,
            quantity: order.quantity,
            requests: {
              type: "GET",
              url: "http://localhost:3000/orders/" + order._id,
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: product._id,
        quantity: req.body.quantity,
      });
      order
        .save()
        .then((result) => {
          res.status(201).json({
            message: "Order stored",
            products: {
              _id: result._id,
              name: result.name,
              price: result.price,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + result._id,
              },
            },
          });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: "Product not found!", error });
    });
};

exports.orders_get_an_order = (req, res, next) => {
  const id = req.params.orderId;

  Order.findById(id)
    .select("_id product quantity")
    .populate("product")
    .exec()
    .then((order) => {
      if (order) {
        res.status(200).json({
          products: order,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for prrovided ID" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.orders_delete_an_order = (req, res, next) => {
  const id = req.params.orderId;

  Order.remove({ _id: id })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Order deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/orders",
            body: {
              product: "Product ID",
              quantity: "Number",
            },
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
