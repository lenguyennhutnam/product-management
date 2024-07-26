import {
    actionBoxSubmit,
    detailAction,
    editAction,
    trashAction,
    changeStatusAction,
} from "./helper/action.helper.js";
import { createAction, editActionSubmit } from "./helper/action.helper.js";
import { fireAlert } from "./helper/alert.helper.js";

//Multi action
const fetchAction = (updateStatusData) => {
    let actionApi = "change-multi-status";
    updateStatusData.accountIds = updateStatusData.itemIds;
    if (updateStatusData.action == "toTrash") {
        actionApi = "delete-multi";
    }
    fetch(`/admin/accounts/${actionApi}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateStatusData),
    })
        .then((res) => res.json())
        .then((data) => {
            fireAlert(data.code, data.msg);
        });
};
actionBoxSubmit(fetchAction, "account-id");
// End multi action

// Detail account
detailAction("accounts", "account-id");
// End detail account

// Edit account
editAction("accounts", "account-id");
// End edit account

// Send to trash
trashAction("accounts", "account-id");
// End send to trash

// Change status
changeStatusAction("accounts", "account-id");
// End change status

createAction() 
editActionSubmit()