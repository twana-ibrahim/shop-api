const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.users_create_new_user = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        return res.status(400).json({ message: "Duplicated Email!!" });
      } else {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) {
            res.status(500).json({ error });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((response) => {
                res.status(201).json({
                  message: "User created successfully",
                  user: response,
                });
              })
              .catch((error) => {
                res.status(500).json({ error });
              });
          }
        });
      }
    });
};

exports.users_login_a_user = (req, res, next) => {
  User.find({ email: req.body.email })
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({ message: "Auth failed" });
      }
      bcrypt.compare(req.body.password, user[0].password, (error, result) => {
        if (error) {
          return res.status(401).json({ message: "Auth failed" });
        }
        if (result) {
          const token = jwt.sign(
            { email: user[0].email, userId: user[0]._id },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          return res.status(200).json({ message: "Auth Successful", token });
        }
        res.status(401).json({ message: "Auth failed" });
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.users_delete_a_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((response) => {
      res.status(200).json({ message: "User deleted!" });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
