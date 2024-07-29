const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [GET] /cart
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
        res.render("client/pages/cart", {
            cartDetail: cartDetail,
        });
    } catch (err) {
        res.redirect("/");
    }
};
// [POST] /cart/add/:id
module.exports.add = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity);
    try {
        const cart = await Cart.findOne({
            _id: cartId,
        });
        const existed = cart.products.find((product) => {
            return product.productId == productId;
        });
        if (!existed) {
            await Cart.updateOne(
                { _id: cartId },
                {
                    $push: {
                        products: { productId: productId, quantity: quantity },
                    },
                }
            );
        } else {
            await Cart.updateOne(
                { _id: cartId, "products.productId": productId },
                {
                    $set: {
                        "products.$.quantity": quantity + existed.quantity,
                    },
                }
            );
        }
        res.json({ code: 200, message: "Sản phẩm đã được thêm vào giỏ hàng!" });
    } catch (err) {
        res.json({ code: 500, message: `Lỗi ${err}` });
    }
};
// [GET] /cart/delete/:id
module.exports.delete = async (req, res) => {
    const productId = req.params.id;
    const cartId = req.cookies.cartId;
    try {
        await Cart.updateMany(
            { _id: cartId },
            { $pull: { products: { productId: productId } } }
        );
        res.redirect("back");
    } catch (err) {
        res.redirect("/");
    }
};
// [PATCH] /cart/update
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);
    if (cartId && productId && quantity > 0) {
        await Cart.updateOne(
            {
                _id: cartId,
                "products.productId": productId,
            },
            {
                $set: {
                    "products.$.quantity": quantity,
                },
            }
        );
        res.json({ totalPrice: (quantity * req.body.newPrice).toFixed(2) });
    }
};
