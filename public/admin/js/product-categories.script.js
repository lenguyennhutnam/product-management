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
