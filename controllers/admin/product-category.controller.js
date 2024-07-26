const ProductCategory = require("../../models/product-category.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const multiMenu = require("../../helpers/multiMenu.helper.js");
const productCategoryMenu = require("../../helpers/product-category.helper.js");
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
        .lean()
        .limit(pagination.limit)
        .skip(pagination.skip)
        .sort(sort);
    for (item of productCategories) {
        if (item.parent_id) {
            const parentItem = await ProductCategory.findOne({
                _id: item.parent_id,
            }).exec();
            item.parentName = parentItem.title;
        } else {
            item.parentName = "_";
        }
    }
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
        // productCategories: multiMenu.createMultiMenu(productCategories),
        productCategories: await productCategoryMenu(),
    });
};
// [POST] /admin/product-categories/create
module.exports.createPost = async (req, res) => {
    if (res.locals.role.permissions.includes("product-categories_edit")) {
        const numberProduct = await ProductCategory.countDocuments({});

        req.body.position = parseInt(req.body.position) || numberProduct + 1;
        const newProduct = new ProductCategory(req.body);
        try {
            await newProduct.save();
            res.json({ code: 200, msg: "Tạo mới thành công!" });
        } catch {
            res.json({ code: 500, msg: "Đã xảy ra lỗi!" });
        }
    }
};
// [GET] /admin/product-categories/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const productCategory = await ProductCategory.findOne({
            _id: id,
            deleted: false,
        });
        if (productCategory.parent_id) {
            const parentItem = await ProductCategory.findOne({
                _id: productCategory.parent_id,
                deleted: false,
            });
            productCategory.parentItem = parentItem;
        }
        productCategory.parentItem = res.render(
            "admin/pages/product-categories/detail",
            {
                productCategory: productCategory,
            }
        );
    } catch {
        res.redirect("back");
    }
};
// [GET] /admin/product-categories/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const productCategory = await ProductCategory.findOne({
            _id: id,
            deleted: false,
        });
        res.render("admin/pages/product-categories/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            productCategory: productCategory,
            productCategories: await productCategoryMenu(),
        });
    } catch (error) {
        res.redirect("back");
    }
};
// [PATCH] /admin/product-categories/edit/:id
module.exports.editPatch = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        try {
            const id = req.params.id;
            const numberItem = await ProductCategory.countDocuments({});

            req.body.position = parseInt(req.body.position) || numberItem + 1;
            await ProductCategory.updateOne(
                {
                    _id: id,
                    deleted: false,
                },
                req.body
            );
            res.json({ code: 200, msg: "Chỉnh sửa thành công!" });
        } catch (error) {
            res.json({ code: 500, msg: "Đã xảy ra lỗi!" });
        }
    }
};
// [PATCH] /admin/product-categories/delete/:id
module.exports.delete = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_delete")) {
        const itemId = req.params.id;
        const currdate = new Date();
        try {
            if (itemId) {
                await ProductCategory.updateOne(
                    { _id: itemId },
                    { deleted: true, timeDelete: currdate }
                );
            }
            res.json({ code: 200, msg: "Đã chuyển vào thùng rác" });
        } catch (error) {
            res.json({ code: 500, msg: "Đã xảy ra lỗi!" });
        }
    }
};
// [PATCH] /admin/product-categories/deleteMulti
module.exports.deleteMulti = async (req, res) => {
    if (res.locals.role.permissions.includes("accounts_delete")) {
        const currdate = new Date();
        const { productIds } = req.body;
        try {
            if (productIds) {
                await ProductCategory.updateMany(
                    { _id: productIds },
                    { deleted: true, timeDelete: currdate }
                );
                res.json({ code: 200, msg: "Xóa thành công!" });
                return;
            }
        } catch {}
        res.json({ code: 500, msg: "Đã xảy ra lỗi!" });
    }
};
// [PATCH] /admin/product-categories/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const changeProduct = await ProductCategory.findOne({
            _id: req.params.id,
        });
        const newStatus =
            changeProduct.status == "active" ? "inactive" : "active";
        await ProductCategory.updateOne(
            { _id: req.params.id },
            { status: newStatus }
        );
        res.json({
            code: 200,
            oldStatus:
                changeProduct.status == "inactive"
                    ? "btn-danger"
                    : "btn-success",
            newStatus: newStatus == "inactive" ? "btn-danger" : "btn-success",
            text: newStatus == "active" ? "Hoạt động" : "Ngừng hoạt động",
        });
    } catch (err) {
        res.redirect("back");
    }
};
// [PATCH] /admin/product-categories/change-multi-status
module.exports.changeMultiStatus = async (req, res) => {
    const { action, productIds } = req.body;
    try {
        await ProductCategory.updateMany(
            { _id: productIds },
            { status: action }
        );
        res.json({ code: 200, msg: "Cập nhật thành công!" });
    } catch {
        res.json({ code: 500, msg: "Đã xảy ra lỗi!" });
    }
};

// [PATCH] /admin/product-categories/change-position
module.exports.changePosition = async (req, res) => {
    const { productId, position } = req.body;
    try {
        await ProductCategory.updateOne(
            { _id: productId },
            { position: position }
        );
        res.json({ code: 200 });
        return;
    } catch {
        res.json({ code: 500 });
    }
};
