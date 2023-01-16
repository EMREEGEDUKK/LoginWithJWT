const Users = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Error } = require("mongoose");

const expireTime = 3 * 34 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, "emre", {
    expiresIn: expireTime,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  

  console.log(err);
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCrdentials: true,
      httpOnly: false,
      maxAge: expireTime,
    });

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};
module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
      const user = await Users.login(email, password);
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: false, maxAge: expireTime * 1000 });
      res.status(200).json({ user: user._id, status: true });
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.json({ errors, status: false });
    }
   
  } ;
