const Product = require("../models/product");
const mongoose = require("mongoose");

const multer = require("multer");

const storage = multer.diskStorage({
  // set the destination to save the file
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  // set the name of the uploaded file
  filename: (req, file, callback) => {
    callback(
      null,
      new Date().toDateString().replace(/\s/g, "") + file.originalname
    );
  },
});

// the size of the uploaded file
const fileSize = 1024 * 1024;

// set a filter to the file
const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({ storage, limits: fileSize, fileFilter });

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("_id name price productImage")
    .exec()
    .then((products) => {
      const response = {
        success: true,
        count: products.length,
        products: products.map((product) => {
          return {
            _id: product._id,
            name: product.name,
            price: product.price,
            productImage: product.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + product._id,
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((error) => res.status(500).json({ error }));
};

(exports.products_create_a_product = upload.single("productImage")),
  (req, res, next) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
    });

    product
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Created product successfully",
          products: {
            _id: result._id,
            name: result.name,
            price: result.price,
            productImage: req.file.path,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + result._id,
            },
          },
        });
      })
      .catch((err) => console.error(err));
  };

exports.products_get_a_product = (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .select("_id name price productImage")
    .exec()
    .then((product) => {
      if (product) {
        res.status(200).json({
          products: product,
          request: {
            type: "GET",
            url: "http://localhost:3000/products",
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

exports.products_update_a_product = (req, res, next) => {
  const id = req.params.productId;

  const newData = new Product({
    name: req.body.name && req.body.name,
    price: req.body.price && req.body.price,
  });

  Product.updateOne({ _id: id }, checkAuth, { $set: newData })
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Product Updated",
          request: {
            type: "GET",
            url: "http://localhost:300/products/" + id,
          },
        });
      } else {
        res.status(404).json({ message: "No valid entry for provided ID" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.products_delete_a_product = (req, res, next) => {
  const id = req.params.productId;

  Product.remove({ _id: id })
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Product deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/products",
            body: {
              name: "String",
              price: "Number",
            },
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
