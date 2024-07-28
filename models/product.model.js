const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        title: String,
        category_id: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        featured: String,
        position: Number,
        deleted: {
            type: Boolean,
            default: false,
        },
        timeDelete: Date,
        deledtedBy: String,
        createdBy: String,
        updatedBy: String,
        slug: {
            type: String,
            slug: "title",
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema, "products");
