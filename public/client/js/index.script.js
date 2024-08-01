// Show alert
const showAlert = document.querySelector(".show-alert");
if (showAlert) {
    let time = showAlert.getAttribute("show-alert") || 2000;
    time = parseInt(time);
    setTimeout(() => {
        showAlert.classList.add("hidden");
    }, time);
}
// End show alert

const addToCartFrm = document.querySelector("[add-to-cart]");
if (addToCartFrm) {
    const API = addToCartFrm.getAttribute("action");
    addToCartFrm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(addToCartFrm);
        const data = new URLSearchParams(formData);
        fetch(API, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code == 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: data.message,
                        showConfirmButton: true,
                        timer: 2500,
                    }).then(() => {
                        window.location.reload();
                    });
                } else if (data.code == 500) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: data.message,
                        showConfirmButton: true,
                        timer: 2500,
                    }).then(() => {
                        window.location.reload();
                    });
                }
            });
    });
}

const cartTable = document.querySelector("[cart-table]");
if (cartTable) {
    const inputQuantity = cartTable.querySelectorAll("input[name='quantity']");
    inputQuantity.forEach((input) => {
        input.addEventListener("change", (e) => {
            const quantity = input.value;
            const newPrice = input.getAttribute("new-price");
            const productId = input.getAttribute("item-id");
            if (productId && quantity > 0) {
                fetch(`/cart/update`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productId: productId,
                        quantity: quantity,
                        newPrice: newPrice,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        const totalPriceTd = input
                            .closest("tr")
                            .querySelector("td[total-price]");
                        totalPriceTd.innerText = data.totalPrice + "$";
                    });
            }
        });
    });
}

const checkoutFrm = document.querySelector("form[checkout");
if (checkoutFrm) {
    checkoutFrm.addEventListener("submit", (e) => {
        e.preventDefault();
        const API = checkoutFrm.getAttribute("action");
        const formData = new FormData(checkoutFrm);
        const data = new URLSearchParams(formData);
        fetch(API, {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                window.location.href = data.link;
            });
    });
}
