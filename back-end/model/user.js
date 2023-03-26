const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: function (cb, obj) {
        delete obj.__v;
        return obj;
      },
    },
  }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
