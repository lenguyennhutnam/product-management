const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
    {
        title: String,
        parent_id: {
            type: String,
            default: "",
        },
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        deleted: {
            type: Boolean,
            default: false,
        },
        timeDelete: Date,
        slug: {
            type: String,
            slug: "title",
            unique: true,
        },
    },
    {
        timestamps: true, // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
    }
);

const ProductCategory = mongoose.model(
    "ProductCategory",
    productCategorySchema,
    "product-categories"
);

module.exports = ProductCategory;
