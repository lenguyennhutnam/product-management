module.exports = async (products) => {
    products.map((product) => {
        return parseFloat(
            (product.newPrice = (
                (1 - product.discountPercentage / 100) *
                product.price
            ).toFixed(2))
        );
    });
};
