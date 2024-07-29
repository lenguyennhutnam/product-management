const Cart = require("../../models/cart.model");

// [GET] /cart/add/:id
module.exports.add = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.id;
    const quantity = req.body.quantity;
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
                    $set: { "products.$.quantity": quantity },
                }
            );
        }
        res.json({ code: 200, message: "Sản phẩm đã được thêm vào giỏ hàng!" });
    } catch (err) {
        res.json({ code: 500, message: `Lỗi ${err}` });
    }
};
