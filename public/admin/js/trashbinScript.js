import { actionBoxSubmit } from "./helper/checkActionLogic.js";
const url = new URL(window.location.href);

// Form search
const formSearch = document.querySelector("#form-search");
formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = e.target.querySelector("input").value;
    url.searchParams.set("keyword", inputValue);
    window.location.href = url.href;
});
// end form search

// Pagination
const pageBtn = document.querySelectorAll("[page]");
pageBtn.forEach((page) => {
    page.addEventListener("click", () => {
        url.searchParams.set("page", page.getAttribute("page"));
        window.location.href = url.href;
    });
});

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
    if (actionData.action == "recovery") {
        actionAPI = "/admin/trashbin/recovery-many";
    } else if (actionData.action == "delete") {
        actionAPI = "/admin/trashbin/delete-many";
    }
    fetch(actionAPI, {
        method: "PATCH",
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
