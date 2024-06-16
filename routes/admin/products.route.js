const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller.js");

router.get("/", controller.index);
router.patch("/change-status/:id", controller.changeStatus);
router.patch("/change-multi-status", controller.changeMultiStatus);

module.exports = router;
