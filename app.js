const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

// connect to mongoDB database
mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
// apply these things to the requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// allow Cross-Origin-Resource-Sharing (CORS)
app.use((req, res, next) => {
  // you can write a website URL instead of *, it means that only that website can use the api
  res.header("Access-Control-All-Origin", "*");
  //   you can choose the headers type to allow
  res.header(
    "Access-Control-All-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (res.method === "OPTIONS") {
    //   you can use the request methods
    res.header("Access-Control-All-Method", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json();
  }
  next();
});

// by app.use() you can use each middlewares
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// Create a custom error
app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});

// use the custom error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
