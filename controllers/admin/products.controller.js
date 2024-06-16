const Products = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper.js");
const convertDateTime = require("../../helpers/convertDateTime.helper.js");
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

    const products = await Products.find(find)
        .limit(pagination.limit)
        .skip(pagination.skip);
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
    const changeProduct = await Products.findOne({ _id: req.params.id });
    const newStatus = changeProduct.status == "active" ? "inactive" : "active";
    await Products.updateOne({ _id: req.params.id }, { status: newStatus });
    res.json({
        code: 200,
    });
};

// [PATCH] /admin/products/change-multi-status
module.exports.changeMultiStatus = async (req, res) => {
    const { action, productIds } = req.body;
    if (productIds.length > 0) {
        await Products.updateMany({ _id: productIds }, { status: action });
    }
    res.json({ code: 200 });
};

// [PATCH] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
    const productId = req.params.id;
    const currdate = new Date();
    if (productId) {
        await Products.updateOne(
            { _id: productId },
            { deleted: true, timeDelete: currdate }
        );
    }
    res.json({ code: 200 });
};
