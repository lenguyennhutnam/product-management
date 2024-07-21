const { createMultiMenu } = require("./multiMenu.helper");
const ProductCategory = require("../models/product-category.model.js");

module.exports = async () => {
    const productCategories = await ProductCategory.find({});
    return createMultiMenu(productCategories);
};
