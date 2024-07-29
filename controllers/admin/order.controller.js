const Order = require("../../models/order.model");
const calculateOrder = require("../../helpers/calculateOrder.helper");
const paginationHelper = require("../../helpers/pagination.helper.js");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
    // pagination
    const pagination = await paginationHelper.pagination(
        req,
        await Order.countDocuments({}),
        5
    );
    // end pagination
    const orders = await Order.find({})
        .lean()
        .limit(pagination.limit)
        .skip(pagination.skip);
    for (const order of orders) {
        await calculateOrder(order);
    }

    res.render("admin/pages/orders", {
        pageTitle: "Danh sách đơn hàng",
        orders: orders,
        pagination: pagination,
    });
};
