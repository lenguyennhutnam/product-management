// Get id, category, sameCategory helper
const helper = (btn) => {
    const id = btn.getAttribute("data-id");
    const category = btn
        .getAttribute("data-name")
        .split("All")[0]
        .split("_")[0];

    // Danh sách các nút có cùng danh mục
    const sameCategory = document.querySelectorAll(
        `input[data-name*=${category}]:not([data-name*='All'])[data-id="${id}"]`
    );
    return { id, category, sameCategory };
};
// Check all permissions
const selectAllPermissions = document.querySelectorAll(
    "[data-name='permissionsAll']"
);
if (selectAllPermissions) {
    selectAllPermissions.forEach((btn) => {
        btn.addEventListener("change", () => {
            const permissionCheckboxs = document.querySelectorAll(
                `input[data-id="${btn.getAttribute("data-id")}"]`
            );
            permissionCheckboxs.forEach((checkbox) => {
                checkbox.checked = btn.checked;
            });
        });
    });
}

// Nút chọn tất cả của danh mục
const selectAllOfCategorys = document.querySelectorAll(
    `input[data-name*='All']:not([data-name='permissionsAll'])`
);
if (selectAllOfCategorys) {
    selectAllOfCategorys.forEach((btn) => {
        btn.addEventListener("change", () => {
            const { id, category, sameCategory } = helper(btn);
            sameCategory.forEach((checkbox) => {
                checkbox.checked = btn.checked;
            });
            // Nút tất cả quyền trong cột
            const selectAllPermission_InCol = document.querySelector(
                `input[data-name="permissionsAll"][data-id="${id}"]`
            );
            // Tất cả nút chọn tất cả trong cột
            const selectAllsInColumn = Array.from(selectAllOfCategorys).filter(
                (element) => element.getAttribute("data-id") == id
            );
            const selectAllsInColumnChecked = Array.from(
                selectAllOfCategorys
            ).filter(
                (element) =>
                    element.getAttribute("data-id") == id && element.checked
            );
            if (selectAllsInColumn.length == selectAllsInColumnChecked.length) {
                selectAllPermission_InCol.checked = true;
            } else {
                selectAllPermission_InCol.checked = false;
            }
            console.log(selectAllsInColumn);
        });
    });
}

// Danh sách các checkbox cho từng quyền trong từng danh mục
const checkPermissions = document.querySelectorAll(
    "[data-name]:not([data-name*='All'])"
);
if (checkPermissions) {
    checkPermissions.forEach((btn) => {
        btn.addEventListener("change", (e) => {
            const { id, category, sameCategory } = helper(btn);

            // Danh sách nút đã check trong từng danh mục (trừ nút tất cả)
            const checkedList = document.querySelectorAll(
                `input[data-name*=${category}]:not([data-name*='All'])[data-id="${id}"]:checked`
            );

            // Nút chọn tất cả của danh mục
            const selectAllOfCategory = document.querySelector(
                `input[data-name=${category + "All"}][data-id="${id}"]`
            );
            if (checkedList.length == sameCategory.length) {
                selectAllOfCategory.checked = true;
            } else {
                selectAllOfCategory.checked = false;
            }
            // Danh sách các nút của 1 cột (trừ nút tất cả quyền)
            const colCheckbox = document.querySelectorAll(
                `input:not([data-name='permissionsAll'])[data-id="${id}"]`
            );

            // Danh sách các nút của 1 cột (trừ nút tất cả quyền) đã check
            const colCheckboxChecked = document.querySelectorAll(
                `input:not([data-name='permissionsAll'])[data-id="${id}"]:checked`
            );
            // Nút tất cả quyền của cột
            const selectAllPermission = document.querySelector(
                `input[data-name="permissionsAll"][data-id="${id}"]`
            );
            if (colCheckbox.length == colCheckboxChecked.length) {
                selectAllPermission.checked = true;
            } else {
                selectAllPermission.checked = false;
            }
        });
    });
}

// End check all permissions

//
