const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { SECRET } = require("../../config/default.json");

// handle

const handleErrors = (error) => {
  const errors = { email: "", password: "" };

  //dublicate email error handle
  if (error.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }
  //validation errors
  if (error.message.includes("user validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  //incorrect email
  if (error.message === "Incorrect email") {
    errors.email = "that email not regitered";
  }

  //incorrect password
  if (error.message === "Incorrect Password") {
    errors.password = "that password incorrect ";
  }

  return errors;
};

//create Jwt
const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, SECRET, {
    expiresIn: maxAge,
  });
};

//get all users
module.exports.users_get = async (req, res) => {
  await User.find(
    {},
    null,
    { sort: { date: "asc" }, limit: 10 },
    function (error, users) {
      if (error) {
        res.status(404).json("Users not found");
      } else {
        res.status(200).json(users);
      }
    }
  );
};

//get user base on ID
module.exports.users_get_byID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

//user profile update

module.exports.userUpdate = async (req, res, next) => {
  try {
    const newUser = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json(errors);
  }
};
