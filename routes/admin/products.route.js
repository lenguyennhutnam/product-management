const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller.js");

router.get("/", controller.index);
router.get("/change-status/:id", controller.changeStatus);

module.exports = router;
