const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

router.post("/add/:id", controller.add);

module.exports = router;
