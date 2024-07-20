const express = require("express");
const router = express.Router();
const multer = require("multer");
const validate = require("../../validates/admin/product-category.validate.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/product-categories.controller.js");

const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.createPost
);
router.get("/detail/:id", controller.detail);
router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.editPatch
);
router.patch("/delete/:id", controller.delete);
router.patch("/delete-multi", controller.deleteMulti);
router.patch("/change-status/:id", controller.changeStatus);
router.patch("/change-position", controller.changePosition);
router.patch("/change-multi-status", controller.changeMultiStatus);

module.exports = router;
