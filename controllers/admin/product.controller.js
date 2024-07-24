const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/product-category.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const systemConfig = require("../../config/system.js");
const productCategoryMenu = require("../../helpers/product-category.helper.js");
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
    const pagination = await paginationHelper.pagination(
        req,
        await Product.countDocuments(find)
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
    const products = await Product.find(find)
        .lean()
        .limit(pagination.limit)
        .skip(pagination.skip)
        .sort(sort);
    res.render("admin/pages/products", {
        pageTitle: "Sản phẩm",
        products: products,
        keyword: keyword,
        filterStatus: filterStatus,
        pagination: pagination,
    });
};
// [PATCH] /admin/products/change-status/:id
module.exports.changeStatus = async (req, res) => {
    if (res.locals.role.permission.includes("products_edit")) {
        try {
            const changeProduct = await Product.findOne({ _id: req.params.id });
            const newStatus =
                changeProduct.status == "active" ? "inactive" : "active";
            await Product.updateOne(
                { _id: req.params.id },
                { status: newStatus }
            );
            res.json({
                code: 200,
                oldStatus:
                    changeProduct.status == "inactive"
                        ? "btn-danger"
                        : "btn-success",
                newStatus:
                    newStatus == "inactive" ? "btn-danger" : "btn-success",
                text: newStatus == "active" ? "Hoạt động" : "Ngừng hoạt động",
            });
        } catch (err) {
            res.redirect("back");
        }
    } else {
        res.send("403");
    }
};
// [PATCH] /admin/products/change-multi-status
module.exports.changeMultiStatus = async (req, res) => {
    if (res.locals.role.permission.includes("products_edit")) {
        const { action, productIds } = req.body;
        if (productIds.length > 0) {
            try {
                await Product.updateMany(
                    { _id: productIds },
                    { status: action }
                );
                res.json({ code: 200 });
                return;
            } catch {
                res.json({ code: 500 });
            }
        }
    } else {
        res.send("403");
    }
};
// [PATCH] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
    if (res.locals.role.permission.includes("products_delete")) {
        const productId = req.params.id;
        const currdate = new Date();
        try {
            await Product.updateOne(
                { _id: productId },
                { deleted: true, timeDelete: currdate }
            );
            res.json({ code: 200 });
            return;
        } catch (err) {
            res.json({ code: 500 });
        }
    } else {
        res.send("403");
    }
};
// [PATCH] /admin/products/deleteMulti
module.exports.deleteMulti = async (req, res) => {
    if (res.locals.role.permission.includes("products_delete")) {
        const currdate = new Date();
        const { productIds } = req.body;
        try {
            await Product.updateMany(
                { _id: productIds },
                { deleted: true, timeDelete: currdate }
            );
            res.json({ code: 200 });
            return;
        } catch {
            res.json({ code: 500 });
        }
    } else {
        res.send("403");
    }
};
// [PATCH] /admin/products/change-position
module.exports.changePosition = async (req, res) => {
    if (res.locals.role.permission.includes("products_edit")) {
        const { productId, position } = req.body;
        try {
            await Product.updateOne({ _id: productId }, { position: position });
            res.json({ code: 200 });
            return;
        } catch {
            res.json({ code: 500 });
        }
    } else {
        res.send("403");
    }
};
// [GET] /admin/products/create
module.exports.createPage = async (req, res) => {
    res.render("admin/pages/products/create.pug", {
        pageTitle: "Thêm mới sản phẩm",
        productCategories: await productCategoryMenu(),
    });
};
// [POST] /admin/products/create
module.exports.create = async (req, res) => {
    if (res.locals.role.permission.includes("products_create")) {
        req.body.price = parseInt(req.body.price) || 0;
        req.body.discountPercentage =
            parseInt(req.body.discountPercentage) || 0;
        req.body.stock = parseInt(req.body.stock) || 0;
        const numberProduct = await Product.countDocuments({});

        req.body.position = parseInt(req.body.position) || numberProduct + 1;
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    } else {
        res.send("403");
    }
};
// [GET] /admin/products/edit/:id
module.exports.editPage = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id,
            deleted: false,
        });

        if (product) {
            res.render("admin/pages/products/edit", {
                pageTitle: "Chỉnh sửa sản phẩm",
                product: product,
                productCategories: await productCategoryMenu(),
            });
        } else {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
};
// [PATCH] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    if (res.locals.role.permission.includes("products_edit")) {
        try {
            const id = req.params.id;
            //parse to db type
            req.body.price = parseInt(req.body.price) || 0;
            req.body.discountPercentage =
                parseInt(req.body.discountPercentage) || 0;
            req.body.stock = parseInt(req.body.stock) || 0;
            const numberProduct = await Product.countDocuments({});

            req.body.position =
                parseInt(req.body.position) || numberProduct + 1;
            await Product.updateOne(
                {
                    _id: id,
                    deleted: false,
                },
                req.body
            );

            req.flash("success", "Cập nhật sản phẩm thành công!");
        } catch (error) {
            req.flash("error", "Id sản phẩm không hợp lệ!");
        }
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    } else {
        res.send("403");
    }
};
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({
            _id: id,
            deleted: false,
        }).lean();
        if (product.category_id) {
            product.category = await ProductCategory.findOne({
                _id: product.category_id,
            }).lean();
        }

        if (product) {
            res.render("admin/pages/products/detail", {
                pageTitle: "Chi tiết sản phẩm",
                product: product,
            });
        } else {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } catch (error) {
        console.log(error);
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
};
