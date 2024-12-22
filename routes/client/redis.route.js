const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/redis.controller");

// router.get("/", controller.index);
router.get("/clear", controller.clear);
router.get("/detail/:slug", controller.detail);

module.exports = router;
