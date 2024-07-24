const { createMultiMenu } = require("./multiMenu.helper");
const ProductCategory = require("../models/product-category.model.js");

module.exports = async () => {
    const productCategories = await ProductCategory.find({ deleted: false });
    return createMultiMenu(productCategories);
};
