const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper.js");
const convertDateTime = require("../../helpers/convertDateTime.helper.js");
const systemConfig = require("../../config/system");
// [GET] /admin/products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    // filter products
    const filterStatus = [
        { title: "Tất cả", status: "" },
        { title: "Hoạt động", status: "active" },
        { title: "Dừng hoạt động", status: "inactive" },
    ];
    if (req.query.status) {
        find.status = req.query.status;
    }
    // search products
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }
    // pagination
    const pagination = await paginationHelper.pagination(req, find);

    const products = await Product.find(find)
        .limit(pagination.limit)
        .skip(pagination.skip)
        .sort({ position: "desc" });
    res.render("admin/pages/products", {
        pageTitle: "Products",
        products: products,
        keyword: keyword,
        filterStatus: filterStatus,
        pagination: pagination,
    });
};
// [PATCH] /admin/products/change-status/:id
module.exports.changeStatus = async (req, res) => {
    req.flash("success", "Cập nhật thành công");
    const changeProduct = await Product.findOne({ _id: req.params.id });
    const newStatus = changeProduct.status == "active" ? "inactive" : "active";
    await Product.updateOne({ _id: req.params.id }, { status: newStatus });
    res.json({
        code: 200,
    });
};
// [PATCH] /admin/products/change-multi-status
module.exports.changeMultiStatus = async (req, res) => {
    const { action, productIds } = req.body;
    if (productIds.length > 0) {
        await Product.updateMany({ _id: productIds }, { status: action });
        req.flash("success", "Cập nhật thành công");
    }
    res.json({ code: 200 });
};
// [PATCH] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
    const productId = req.params.id;
    const currdate = new Date();
    if (productId) {
        req.flash("success", "Đã chuyển sản phẩm vào thùng rác");
        await Product.updateOne(
            { _id: productId },
            { deleted: true, timeDelete: currdate }
        );
    }
    res.json({ code: 200 });
};
// [PATCH] /admin/products/deleteMulti
module.exports.deleteMulti = async (req, res) => {
    const currdate = new Date();
    const { productIds } = req.body;
    if (productIds) {
        req.flash(
            "success",
            `Đã chuyển ${productIds.length} sản phẩm vào thùng rác`
        );
        await Product.updateMany(
            { _id: productIds },
            { deleted: true, timeDelete: currdate }
        );
    }
    res.json({ code: 200 });
};
// [PATCH] /admin/products/change-position
module.exports.changePosition = async (req, res) => {
    const { productId, position } = req.body;
    if (productId) {
        await Product.updateOne({ _id: productId }, { position: position });
    }
    res.json({ code: 200 });
};
// [GET] /admin/products/create
module.exports.createPage = async (req, res) => {
    res.render("admin/pages/products/create.pug", {
        pageTitle: "Thêm mới sản phẩm",
    });
};

// [POST] /admin/products/create
module.exports.create = async (req, res) => {
    if (req.file && req.file.filename) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    const numberProduct = await Product.countDocuments({});

    req.body.position = parseInt(req.body.position) || numberProduct + 1;
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
};
