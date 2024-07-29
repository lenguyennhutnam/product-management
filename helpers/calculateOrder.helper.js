const Product = require("../models/product.model.js");
const newPrice = require("./caculateNewPrice.helper.js");

module.exports = async (order) => {
    let totalPrice = 0;
    newPrice(order.products);
    for (const product of order.products) {
        const productDetail = await Product.findOne({
            _id: product.productId,
        }).select("title thumbnail price");
        product.thumbnail = productDetail.thumbnail;
        product.title = productDetail.title;
        product.totalPrice = product.quantity * product.newPrice;
        totalPrice += product.totalPrice;
    }
    order.totalPrice = totalPrice.toFixed(2);
};
