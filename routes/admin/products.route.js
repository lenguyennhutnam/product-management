const express = require("express");
const multer = require("multer");
const validate = require("../../validates/admin/product.validate.js");
const storageMulterHelper = require("../../helpers/storageMulter.helper.js");

const upload = multer({ storage: storageMulterHelper.storage });

const router = express.Router();
const controller = require("../../controllers/admin/products.controller.js");

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
    validate.createPost,
    controller.create
);
router.get("/edit/:id", controller.editPage);
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    validate.createPost,
    controller.edit
);

module.exports = router;
