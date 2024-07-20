const express = require("express");
const router = express.Router();
const multer = require("multer");
const validate = require("../../validates/admin/product.validate.js");
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
router.patch("/delete/:id", controller.delete);
router.patch("/delete-multi", controller.deleteMulti);

module.exports = router;
