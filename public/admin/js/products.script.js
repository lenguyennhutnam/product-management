import {
    actionBoxSubmit,
    detailAction,
    editAction,
    trashAction,
} from "./helper/action.helper.js";

//Multi action
const fetchAction = (updateStatusData) => {
    let actionApi = "change-multi-status";
    updateStatusData.productIds = updateStatusData.itemIds;
    if (updateStatusData.action == "toTrash") {
        actionApi = "delete-multi";
    }
    fetch(`/admin/products/${actionApi}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateStatusData),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.code == 200) {
                window.location.reload();
            }
        });
};
actionBoxSubmit(fetchAction, "product-id");
// End multi action

// Detail product
detailAction("products", "product-id");
// End detail product

// Edit product
editAction("products", "product-id");
// End edit product

// Send to trash
trashAction("products", "product-id");
// End send to trash

// Change status
const changeStatusBtns = document.querySelectorAll("[change-status-btn]");
if (changeStatusBtns) {
    changeStatusBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const productId = btn.closest("tr").getAttribute("product-id");
            const API = `/admin/products/change-status/${productId}`;
            fetch(API, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == 200) {
                        window.location.reload();
                    }
                });
        });
    });
}
// End change status

// Set position
const posInput = document.querySelectorAll("input[name=position]");
posInput.forEach((input) => {
    input.addEventListener("change", (e) => {
        const productId = input.closest("tr").getAttribute("product-id");
        const API = `/admin/products/change-position`;
        fetch(API, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: productId,
                position: input.value,
            }),
        });
    });
});
// End set position
