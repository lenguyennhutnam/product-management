import {
    actionBoxSubmit,
    detailAction,
    editAction,
    trashAction,
    changeStatusAction,
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
                sessionStorage.setItem("updated", "success");
                window.location.reload();
            } else if (data.code == 500) {
                sessionStorage.setItem("updated", "error");
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
changeStatusAction("products", "product-id");
// End change status

// Set position
const posInput = document.querySelectorAll("input[name=position]");
if (posInput) {
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
}
// End set position
