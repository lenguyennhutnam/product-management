const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const convertDateTime = require("../../helpers/convertDateTime.helper.js");

// [GET] /admin/trashbin
module.exports.index = async (req, res) => {
    const category = req.query.category || "products";
    const model = { products: Product, "product-categories": ProductCategory };
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
    const pagination = await paginationHelper.pagination(
        req,
        await model[category].countDocuments(find)
    );

    const items = await model[category]
        .find(find)
        .lean()
        .limit(pagination.limit)
        .skip(pagination.skip)
        .sort({
            timeDelete: "desc",
        });
    for (item of items) {
        item.timeDelete = convertDateTime(items.timeDelete);
        item.id = items._id;
    }
    res.render("admin/pages/trashbin", {
        pageTitle: "Trash bin",
        category: category,
        items: items,
        keyword: keyword,
        pagination: pagination,
    });
};

// [PATCH] /admin/trashbin/recovery/:id
module.exports.recovery = async (req, res) => {
    const { category } = req.body;
    const model = { products: Product, "product-categories": ProductCategory };
    const item = req.params.id;
    if (item) {
        req.flash("success", "Khôi phục thành công");
        await model[category].updateOne(
            { _id: item },
            { deleted: false, status: "inactive" }
        );
    }
    res.json({ code: 200 });
};

// [DELETE] /admin/trashbin/delete/:id
module.exports.delete = async (req, res) => {
    const { category } = req.body;
    const model = { products: Product, "product-categories": ProductCategory };
    const productId = req.params.id;
    if (productId) {
        req.flash("error", "Sản phẩm đã được xóa vĩnh viễn");
        await model[category].deleteOne({ _id: productId });
    }
    res.json({ code: 200 });
};

// [PATCH] /admin/trashbin/recovery-many
module.exports.recoveryMany = async (req, res) => {
    const { category } = req.body;
    const model = { products: Product, "product-categories": ProductCategory };
    const { itemIds } = req.body;
    req.flash("success", `Khôi phục thành công ${itemIds.length} sản phẩm`);
    await model[category].updateMany({ _id: itemIds }, { deleted: false });
    res.json({ code: 200 });
};
// [DELETE] /admin/trashbin/delete-many
module.exports.deleteMany = async (req, res) => {
    const { category } = req.body;
    const model = { products: Product, "product-categories": ProductCategory };
    const { itemIds } = req.body;
    req.flash("error", `${itemIds.length} sản phẩm đã được xóa vĩnh viễn`);
    await model[category].deleteMany({ _id: itemIds });
    res.json({ code: 200 });
};
