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

//sign up

module.exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
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

//login

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json("please Provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correntpassword(password, user.password))) {
    return res.status(401).json("Incurrect email or password ");
  }

  const token = createToken(user);
  res.status(200).json({
    status: "success",
    token,
    user,
  });
};

//forgot password
// module.exports.forgotPassword = async(req, res, next)=>{

//     const user = await User.findOne({email:req.body.email})

//     if(!user){
//         res.status(404).json("User not found");
//     }

//     const resetToken = user.createPasswordResetToken();
//     await user.save({validateBeforeSave:false});

// }

//reset password
// module.exports.resetPassword = (req, res, next)=>{

// }
