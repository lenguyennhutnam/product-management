const express = require("express");

const router = express.Router();
const controller = require("../../controllers/admin/role.controller.js");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);
router.delete("/delete/:id", controller.delete);
router.get("/permissions", controller.permissions);
router.patch("/permissions", controller.permissionPatch);

module.exports = router;