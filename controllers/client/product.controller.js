// [GET] /products

module.exports.index = (req, res) => {
    res.render("client/pages/products");
};

// [PATCH] /products/edit
module.exports.edit = (req, res) => {
    res.render("client/pages/products/edit");
};

// [DELETE] /products/delete
module.exports.delete = (req, res) => {
    res.render("client/pages/products/delete");
};
