const Products = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper.js");
const convertDateTime = require("../../helpers/convertDateTime.helper.js");

// [GET] /admin/trashbin
module.exports.index = async (req, res) => {
    const find = {
        deleted: true,
    };

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
        .skip(pagination.skip)
        .lean();
    products.forEach((product) => {
        product.timeDelete = convertDateTime(product.timeDelete);
        product.id = product._id;
    });
    res.render("admin/pages/trashbin", {
        pageTitle: "Trash bin",
        products: products,
        keyword: keyword,
        pagination: pagination,
    });
};

// [PATCH] /admin/trashbin/recovery/:id
module.exports.recovery = async (req, res) => {
    const productId = req.params.id;
    if (productId) {
        await Products.updateOne(
            { _id: productId },
            { deleted: false, status: "inactive" }
        );
    }
    res.json({ code: 200 });
};

// [DELETE] /admin/trashbin/delete/:id
module.exports.delete = async (req, res) => {
    const productId = req.params.id;
    if (productId) {
        await Products.deleteOne({ _id: productId });
    }
    res.json({ code: 200 });
};

// [PATCH] /admin/trashbin/recovery-many
module.exports.recoveryMany = async (req, res) => {
    const { productIds } = req.body;
    await Products.updateMany({ _id: productIds }, { deleted: false });
    res.json({ code: 200 });
};
// [DELETE] /admin/trashbin/delete-many
module.exports.deleteMany = async (req, res) => {
    const { productIds } = req.body;
    await Products.deleteMany({ _id: productIds });
    res.json({ code: 200 });
};
