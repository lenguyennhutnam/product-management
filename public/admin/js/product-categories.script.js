import {
    actionBoxSubmit,
    detailAction,
    editAction,
    trashAction,
    changeStatusAction,
} from "./helper/action.helper.js";

// Change status
changeStatusAction("product-categories", "productCategory-id");
// End change status

//Multi action
const fetchAction = (updateStatusData) => {
    let actionApi = "change-multi-status";
    updateStatusData.productIds = updateStatusData.itemIds;
    if (updateStatusData.action == "toTrash") {
        actionApi = "delete-multi";
    }
    fetch(`/admin/product-categories/${actionApi}`, {
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
actionBoxSubmit(fetchAction, "productCategory-id");
// End multi action

// Detail product
detailAction("product-categories", "productCategory-id");
// End detail product

// Edit product
editAction("product-categories", "productCategory-id");
// End edit product

// Send to trash
trashAction("product-categories", "productCategory-id");
// End send to trash

// Set position
const posInput = document.querySelectorAll("input[name=position]");
posInput.forEach((input) => {
    input.addEventListener("change", (e) => {
        const productId = input.closest("tr").getAttribute("productCategory-id");
        const API = `/admin/product-categories/change-position`;
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