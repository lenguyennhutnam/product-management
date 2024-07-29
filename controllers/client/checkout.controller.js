const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const newPrice = require("../../helpers/caculateNewPrice.helper");
const calculateOrder = require("../../helpers/calculateOrder.helper");

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
// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const userInfo = req.body;
    const orderData = {
        userInfo: userInfo,
        products: [],
    };

    // get cart
    const cart = await Cart.findOne({ _id: req.cookies.cartId });
    for (const product of cart.products) {
        const productDetail = await Product.findOne({ _id: product.productId });
        const productOrder = {
            productId: product.productId,
            price: productDetail.price,
            discountPercentage: productDetail.discountPercentage,
            quantity: product.quantity,
        };
        orderData.products.push(productOrder);
    }
    const order = new Order(orderData);
    await order.save();
    await Cart.updateOne(
        {
            _id: req.cookies.cartId,
        },
        {
            products: [],
        }
    );
    res.json({ link: `/checkout/success/${order.id}` });
};
// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({ _id: orderId }).lean();
        await calculateOrder(order);
        res.render("client/pages/checkout/success", {
            pageTitle: "Đặt hàng thành công",
            order: order,
            totalPrice: order.totalPrice,
        });
    } catch (err) {
        console.log(err);
        // res.redirect("/");
    }
};
