const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller.js");

router.get("/", controller.index);
router.patch("/change-status/:id", controller.changeStatus);
router.patch("/change-multi-status", controller.changeMultiStatus);
router.patch("/delete/:id", controller.delete);

module.exports = router;
