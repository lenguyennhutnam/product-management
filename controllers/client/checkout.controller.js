const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [GET] /checkout/
module.exports.index = async (req, res) => {
    try {
        const cartDetail = await Cart.findOne({ _id: req.cookies.cartId });
        let totalPrice = 0;
        for (const product of cartDetail.products) {
            const productInfo = await Product.findOne({
                _id: product.productId,
            }).select("thumbnail title slug price discountPercentage");
            productInfo.newPrice = parseFloat(
                (1 - productInfo.discountPercentage / 100) * productInfo.price
            ).toFixed(2);
            product.productInfo = productInfo;
            product.totalPrice = productInfo.newPrice * product.quantity;
            totalPrice += product.totalPrice;
        }
        cartDetail.totalPrice = totalPrice.toFixed(2);
        res.render("client/pages/checkout/index", {
            pageTitle: "Đặt hàng",
            cartDetail: cartDetail,
        });
    } catch (err) {
        res.redirect("/");
    }
};
