module.exports.index = (req, res) => {
    res.render("client/pages/products", {pageTitle: "Trang san pham"});
};
module.exports.create = (req, res) => {
    res.send("Prod create");
};
module.exports.delete = (req, res) => {
    res.send("Prod delete");
};
