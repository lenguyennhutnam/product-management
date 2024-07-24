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
            if (data.code == 200) {
                window.location.reload();
            }
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
