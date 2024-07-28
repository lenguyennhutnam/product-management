const ProductCategory = require("../models/product-category.model");

module.exports = async (parentCategoryId) => {
    const subCategoryList = [];
    const getSubCategory = async (currId) => {
        const subCategory = await ProductCategory.find({
            parent_id: currId,
            status: "active",
            deleted: false,
        });
        for (const item of subCategory) {
            subCategoryList.push(item._id);
            await getSubCategory(item._id);
        }
    };
    await getSubCategory(parentCategoryId);
    return subCategoryList;
};
