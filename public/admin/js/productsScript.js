import { actionBoxSubmit } from "./helper/checkActionLogic.js";

// Change status
const changeStatusBtns = document.querySelectorAll("[change-status-btn]");
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
// End change status

//Multi action
const fetchAction = (updateStatusData) => {
    let actionApi = "change-multi-status";
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
actionBoxSubmit(fetchAction);
// End multi action

// Send product to trashbin
const trashBtn = document.querySelectorAll("[send-to-trash]");
trashBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const productId = btn.closest("tr").getAttribute("product-id");
        const deleteAPI = `/admin/products/delete/${productId}`;
        fetch(deleteAPI, {
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
// End send product to trashbin

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
