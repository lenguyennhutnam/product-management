import { actionBoxSubmit } from "./helper/checkActionLogic.js";

// recovery
const recoveryBtn = document.querySelectorAll("[recovery]");
recoveryBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const productId = btn.closest("tr").getAttribute("product-id");
        const API = `/admin/trashbin/recovery/${productId}`;
        fetch(API, {
            method: "PATCH",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code == 200) {
                    window.location.reload();
                }
            });
    });
});
// end recovery

// recovery, delete multi product
const fetchAction = (actionData) => {
    let actionAPI;
    let methodAPI;
    if (actionData.action == "recovery") {
        actionAPI = "/admin/trashbin/recovery-many";
        methodAPI = "PATCH";
    } else if (actionData.action == "delete") {
        actionAPI = "/admin/trashbin/delete-many";
        methodAPI = "DELETE";
    }
    fetch(actionAPI, {
        method: methodAPI,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(actionData),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.code == 200) {
                window.location.reload();
            }
        });
};
actionBoxSubmit(fetchAction);
// End recovery, delete multi product

// Delete product
const deleteBtn = document.querySelectorAll("[permanent-delete");
deleteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const productId = btn.closest("tr").getAttribute("product-id");
        const API = `/admin/trashbin/delete/${productId}`;
        fetch(API, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code == 200) {
                    window.location.reload();
                }
            });
    });
});
// End delete product
