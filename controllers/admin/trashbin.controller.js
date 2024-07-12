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
        .lean()
        .sort({
            timeDelete: "desc",
        });
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
        req.flash("success", "Khôi phục thành công");
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
        req.flash("error", "Sản phẩm đã được xóa vĩnh viễn");
        await Products.deleteOne({ _id: productId });
    }
    res.json({ code: 200 });
};

// [PATCH] /admin/trashbin/recovery-many
module.exports.recoveryMany = async (req, res) => {
    const { productIds } = req.body;
    req.flash("success", `Khôi phục thành công ${productIds.length} sản phẩm`);
    await Products.updateMany({ _id: productIds }, { deleted: false });
    res.json({ code: 200 });
};
// [DELETE] /admin/trashbin/delete-many
module.exports.deleteMany = async (req, res) => {
    const { productIds } = req.body;
    req.flash("error", `${productIds.length} sản phẩm đã được xóa vĩnh viễn`);
    await Products.deleteMany({ _id: productIds });
    res.json({ code: 200 });
};
