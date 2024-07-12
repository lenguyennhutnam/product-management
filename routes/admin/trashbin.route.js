const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/trashbin.controller.js");

router.get("/", controller.index);
router.patch("/recovery/:id", controller.recovery);
router.delete("/delete/:id", controller.delete);
router.patch("/recovery-many", controller.recoveryMany);
router.delete("/delete-many", controller.deleteMany);

module.exports = router;
