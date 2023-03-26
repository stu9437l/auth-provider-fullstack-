const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = require("./route/index");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router);
mongoose
  .connect("mongodb://127.0.0.1:27017/auth-provider")
  .then(() => {
    console.log("Server is connected!");
  })
  .catch(() => {
    console.log("Server failed!");
  });

app.listen(8080, () => {
  console.log("Server listining port :" + 8080);
});
