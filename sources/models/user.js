const crypto = require("crypto");
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: [true],
      lowercase: true,
      validate: [isEmail, "Please Enter the valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter an password"],
      minlength: [6, "Minimum password length is 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    name: {
      type: String,
      required: true,
    },
    permissions: { type: Array, default: ["user"] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const solt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, solt);
  next();
});

userSchema.methods.correntpassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods.createPasswordResetToken =async function(){
//     const resetToken =  crypto.randomBytes(32).toString('hex');
//     const solt = await bcrypt.genSalt();

//     this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//     console.log({resetToken}, this.passwordResetToken)
//     this.passwordResetExpires = Date.now() +10*60*1000;

//     return resetToken;
// }

const User = mongoose.model("user", userSchema);

module.exports = User;
