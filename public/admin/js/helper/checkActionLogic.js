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
export function actionBoxSubmit(fetchAction) {
    const actionBox = document.querySelector(".action-box");
    const actionBtn = actionBox.querySelector("button");
    const actionSelect = actionBox.querySelector("select");
    actionBtn.addEventListener("click", (e) => {
        const actionCheckedList = document.querySelectorAll(
            "input[name='actionChecked']:checked"
        );
        const productIds = Array.from(actionCheckedList).map((btn) => {
            return btn.closest("tr").getAttribute("product-id");
        });
        const action = actionSelect.value;
        const updateStatusData = {
            productIds: productIds,
            action: action,
        };
        fetchAction(updateStatusData);
    });
}
