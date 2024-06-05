const mongoose = require("mongoose");
const { Product } = require("../models/product.model.js");

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Ket noi thanh cong");
    } catch (err) {
        console.log(err);
    }
};
