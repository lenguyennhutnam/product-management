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
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else if (data.code == 500) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: data.message,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            });
    });
}
