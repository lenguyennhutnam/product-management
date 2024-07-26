import {
    actionBoxSubmit,
    detailAction,
    editAction,
    trashAction,
    changeStatusAction,
} from "./helper/action.helper.js";
import { createAction, editActionSubmit } from "./helper/action.helper.js";
import { fireAlert } from "./helper/alert.helper.js";

createAction(false);
editActionSubmit();

// Detail product
detailAction("roles", "role-id");
// End detail role

// Edit role
editAction("roles", "role-id");
// End edit role

// Send to trash
trashAction("roles", "role-id");
// End send to trash
