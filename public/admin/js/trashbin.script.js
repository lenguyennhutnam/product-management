import {
    actionBoxSubmit,
    deleteAction,
    recoveryAction,
} from "./helper/action.helper.js";
import { fireAlert } from "./helper/alert.helper.js";

const url = new URL(window.location.href);

const categoryBtn = document.querySelector("[category]");
categoryBtn.addEventListener("change", (e) => {
    const category = categoryBtn.value;
    url.searchParams.set("category", category);
    window.location.href = url;
});
// Thêm selected mặc định cho option
const defaultCategory = url.searchParams.get("category") || "products";
const optionSelected = categoryBtn.querySelector(
    `option[value="${defaultCategory}"]`
);
optionSelected.selected = true;
//  End thêm selected mặc định cho option

// recovery, delete multi product
const fetchAction = (actionData) => {
    let actionAPI;
    let methodAPI;
    actionData.productIds = actionData.itemIds;
    actionData.category = defaultCategory;
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
            fireAlert(data.code, data.msg);
        });
};
let idAtt = "product-id";
if (defaultCategory == "product-categories") {
    idAtt = "productCategory-id";
} else if (defaultCategory == "accounts") {
    idAtt = "account-id";
}
actionBoxSubmit(fetchAction, idAtt);
// End recovery, delete multi product

deleteAction(idAtt, defaultCategory);
recoveryAction(idAtt, defaultCategory);
