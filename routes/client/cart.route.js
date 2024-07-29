const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

router.get("/", controller.index);
router.post("/add/:id", controller.add);
router.get("/delete/:id", controller.delete);
router.patch("/update", controller.update);

module.exports = router;
