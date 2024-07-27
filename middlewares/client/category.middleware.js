const ProductCategory = require("../../models/product-category.model");
const { createMultiMenu } = require("../../helpers/multiMenu.helper");

module.exports.category = async (req, res, next) => {
    const categoryProducts = await ProductCategory.find({
        deleted: false,
        status: "active",
    });

    const newCategoryProducts = createMultiMenu(categoryProducts);

    res.locals.layoutCategoryProducts = newCategoryProducts;

    next();
};
