const express = require("express");
const multer = require("multer");
const validate = require("../../validates/admin/product.validate.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

const upload = multer();

const router = express.Router();
const controller = require("../../controllers/admin/product.controller.js");

router.get("/", controller.index);
router.patch("/change-status/:id", controller.changeStatus);
router.patch("/change-multi-status", controller.changeMultiStatus);
router.patch("/delete/:id", controller.delete);
router.patch("/delete-multi", controller.deleteMulti);
router.patch("/change-position", controller.changePosition);
router.get("/create", controller.createPage);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.create
);
router.get("/edit/:id", controller.editPage);
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.edit
);
router.get("/detail/:id", controller.detail);

module.exports = router;
