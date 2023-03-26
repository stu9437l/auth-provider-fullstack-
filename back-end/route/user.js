const express = require("express");
const {
  Create,
  GetAll,
  Login,
  GoogleLogin,
  DeletebyId,
} = require("../controller/user");
const router = express.Router();

router.post("/create", Create);
router.post("/login", Login);
router.post("/googleLogin", GoogleLogin);

router.get("/getAll", GetAll);
router.delete("/delete", DeletebyId);

module.exports = router;
