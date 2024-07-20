const _actionCheckAllBtn = document.querySelector(
    "input[name='actionCheckAll']"
);
const _actionCheckBtns = document.querySelectorAll(
    "input[name='actionChecked']"
);
// active all event
_actionCheckAllBtn.addEventListener("change", (e) => {
    _actionCheckBtns.forEach((btn) => {
        btn.checked = e.target.checked;
    });
});
// check action event
_actionCheckBtns.forEach((btn) => {
    btn.addEventListener("change", (e) => {
        const _actionCheckedList = document.querySelectorAll(
            "input[name='actionChecked']:checked"
        );
        if (_actionCheckedList.length == _actionCheckBtns.length) {
            _actionCheckAllBtn.checked = true;
        } else {
            _actionCheckAllBtn.checked = false;
        }
    });
});

// submit action box logic
export function actionBoxSubmit(fetchAction, id) {
    const actionBox = document.querySelector(".action-box");
    const actionBtn = actionBox.querySelector("button");
    const actionSelect = actionBox.querySelector("select");
    actionBtn.addEventListener("click", (e) => {
        const actionCheckedList = document.querySelectorAll(
            "input[name='actionChecked']:checked"
        );
        const itemIds = Array.from(actionCheckedList).map((btn) => {
            return btn.closest("tr").getAttribute(id);
        });
        const action = actionSelect.value;
        const updateStatusData = {
            itemIds: itemIds,
            action: action,
        };
        fetchAction(updateStatusData);
    });
}

// Show detail
export function detailAction(item, idAtt) {
    const detailBtn = document.querySelectorAll("[detail]");
    if (detailBtn) {
        detailBtn.forEach((btn) => {
            btn.addEventListener("click", () => {
                const itemId = btn.closest("tr").getAttribute(`${idAtt}`);
                const detailAPI = `/admin/${item}/detail/${itemId}`;
                window.location.href = detailAPI;
                return;
            });
        });
    }
}
// End show detail

// Edit action
export function editAction(item, idAtt) {
    const editBtn = document.querySelectorAll("[edit]");
    if (editBtn) {
        editBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const itemId = btn.closest("tr").getAttribute(`${idAtt}`);
                const editAPI = `/admin/${item}/edit/${itemId}`;
                window.location.href = editAPI;
                return;
            });
        });
    }
}
// End edit action

// Send to trashbin action
export function trashAction(item, idAtt) {
    const trashBtn = document.querySelectorAll("[send-to-trash]");
    if (trashBtn) {
        trashBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const itemId = btn.closest("tr").getAttribute(`${idAtt}`);
                const deleteAPI = `/admin/${item}/delete/${itemId}`;
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
    }
}
// End send to trashbin action

// recovery
export function recoveryAction(idAtt, category) {
    const recoveryBtn = document.querySelectorAll("[recovery]");
    recoveryBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const itemId = btn.closest("tr").getAttribute(`${idAtt}`);
            const API = `/admin/trashbin/recovery/${itemId}`;
            fetch(API, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ category: category }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == 200) {
                        window.location.reload();
                    }
                });
        });
    });
}
// end recovery

// Delete product
export function deleteAction(idAtt, category) {
    const deleteBtn = document.querySelectorAll("[permanent-delete");
    deleteBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const itemId = btn.closest("tr").getAttribute(`${idAtt}`);
            const API = `/admin/trashbin/delete/${itemId}`;
            fetch(API, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ category: category }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == 200) {
                        window.location.reload();
                    }
                });
        });
    });
}
// End delete product
