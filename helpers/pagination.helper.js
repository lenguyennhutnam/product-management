// const Products = require("../models/product.model");

module.exports.pagination = async (req, itemNumber, limit=4) => {
    const pagination = {
        currentPage: 1,
        limit: limit,
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    const numberOfPages = itemNumber / pagination.limit;
    pagination.totalPages = Math.ceil(numberOfPages);
    pagination.skip = (pagination.currentPage - 1) * pagination.limit;

    return pagination;
};
