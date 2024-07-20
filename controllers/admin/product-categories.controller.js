const ProductCategory = require("../../models/product-category.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const systemConfig = require("../../config/system.js");

// [GET] /admin/product-categories
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
    // search product category
    let keyword = "";
    if (req.query.keyword) {
        keyword = req.query.keyword;
        const regex = new RegExp(keyword, "i");
        find.title = regex;
    }
    // pagination
    const pagination = await paginationHelper.pagination(
        req,
        await ProductCategory.countDocuments(find)
    );
    // end pagination
    // Sắp xếp
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // Hết Sắp xếp
    const productCategories = await ProductCategory.find(find)
        .limit(pagination.limit)
        .skip(pagination.skip)
        .sort(sort);
    res.render("admin/pages/product-categories", {
        pageTitle: "Danh mục sản phẩm",
        productCategories: productCategories,
        keyword: keyword,
        filterStatus: filterStatus,
        pagination: pagination,
    });
};
// [GET] /admin/product-categories/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/product-categories/create", {
        pageTitle: "Danh mục sản phẩm",
    });
};
// [POST] /admin/product-categories/create
module.exports.createPost = async (req, res) => {
    const numberProduct = await ProductCategory.countDocuments({});

    req.body.position = parseInt(req.body.position) || numberProduct + 1;
    const newProduct = new ProductCategory(req.body);
    try {
        await newProduct.save();
    } catch {
        req.flash("error", "Tạo mới không thành công");
    } finally {
        req.flash("success", "Tạo mới thành công");
    }
    res.redirect(`/${systemConfig.prefixAdmin}/product-categories`);
};
// [PATCH] /admin/product-categories/delete/:id
module.exports.delete = async (req, res) => {
    const itemId = req.params.id;
    const currdate = new Date();
    try {
        if (itemId) {
            req.flash("success", "Đã chuyển vào thùng rác");
            await ProductCategory.updateOne(
                { _id: itemId },
                { deleted: true, timeDelete: currdate }
            );
        }
        res.json({ code: 200 });
    } catch (err) {
        res.redirect("back");
    }
};
// [PATCH] /admin/product-categories/deleteMulti
module.exports.deleteMulti = async (req, res) => {
    const currdate = new Date();
    const { productIds } = req.body;
    if (productIds) {
        req.flash(
            "success",
            `Đã chuyển ${productIds.length} sản phẩm vào thùng rác`
        );
        await ProductCategory.updateMany(
            { _id: productIds },
            { deleted: true, timeDelete: currdate }
        );
    }
    res.json({ code: 200 });
};
