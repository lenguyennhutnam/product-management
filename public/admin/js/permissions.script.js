// Get id, category, sameCategory helper
const helper = (btn) => {
    const id = btn.getAttribute("data-id");
    const category = btn
        .getAttribute("data-name")
        .split("All")[0]
        .split("_")[0];

    // Danh sách các nút có cùng danh mục
    const sameCategory = document.querySelectorAll(
        `input[data-name*=${category}][select-one][data-id="${id}"]`
    );
    const sameCategoryChecked = document.querySelectorAll(
        `input[data-name*=${category}][select-one][data-id="${id}"]:checked`
    );
    // Danh sách các nút của 1 cột (trừ nút tất cả quyền)
    const colCheckbox = document.querySelectorAll(
        `input[select-one][data-id="${id}"]`
    );

    // Danh sách các nút của 1 cột (trừ nút tất cả quyền) đã check
    const colCheckboxChecked = document.querySelectorAll(
        `input[select-one][data-id="${id}"]:checked`
    );
    return {
        id,
        category,
        sameCategory,
        sameCategoryChecked,
        colCheckbox,
        colCheckboxChecked,
    };
};
// all-permission select-all-category select-one
// Check all permissions
const selectAllPermissions = document.querySelectorAll("input[all-permission]");
if (selectAllPermissions) {
    selectAllPermissions.forEach((btn) => {
        const { id, colCheckbox, colCheckboxChecked } = helper(btn);
        if (colCheckboxChecked.length == colCheckbox.length) {
            btn.checked = true;
        }
        btn.addEventListener("change", () => {
            colCheckbox.forEach((checkbox) => {
                checkbox.checked = btn.checked;
            });
        });
    });
}

// Nút chọn tất cả của danh mục
const selectAllCategorys = document.querySelectorAll(
    `input[select-all-category]`
);
if (selectAllCategorys) {
    selectAllCategorys.forEach((btn) => {
        const { id, sameCategory, sameCategoryChecked } = helper(btn);
        if (sameCategoryChecked.length == sameCategory.length) {
            btn.checked = true;
        }
        btn.addEventListener("change", () => {
            sameCategory.forEach((checkbox) => {
                checkbox.checked = btn.checked;
            });
            // Nút tất cả quyền trong cột
            const selectAllPermission_InCol = document.querySelector(
                `input[all-permission][data-id="${id}"]`
            );
            // Tất cả nút chọn tất cả trong cột
            const selectAllsInColumn = Array.from(selectAllCategorys).filter(
                (element) => element.getAttribute("data-id") == id
            );
            const selectAllsInColumnChecked = Array.from(
                selectAllCategorys
            ).filter(
                (element) =>
                    element.getAttribute("data-id") == id && element.checked
            );
            if (selectAllsInColumn.length == selectAllsInColumnChecked.length) {
                selectAllPermission_InCol.checked = true;
            } else {
                selectAllPermission_InCol.checked = false;
            }
        });
    });
}

// Danh sách các checkbox cho từng quyền trong từng danh mục
const selectOnes = document.querySelectorAll("input[select-one]");
if (selectOnes) {
    selectOnes.forEach((btn) => {
        btn.addEventListener("change", (e) => {
            const {
                id,
                category,
                sameCategory,
                sameCategoryChecked,
                colCheckbox,
                colCheckboxChecked,
            } = helper(btn);

            // Nút chọn tất cả của danh mục
            const categorySelectAll = document.querySelector(
                `input[data-name*=${category}][select-all-category][data-id="${id}"]`
            );
            if (categorySelectAll) {
                if (sameCategoryChecked.length == sameCategory.length) {
                    categorySelectAll.checked = true;
                } else {
                    categorySelectAll.checked = false;
                }
            }

            // Nút tất cả quyền của cột
            const selectAllPermission = document.querySelector(
                `input[all-permission][data-id="${id}"]`
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

// Update permissions
const submitBtn = document.querySelector("button[type=submit]");
if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
        const dataList = [];
        selectOnes.forEach((select) => {
            const id = select.getAttribute("data-id");
            const permission = select.getAttribute("data-name");
            let found = false;
            // Check existed of role
            for (let data of dataList) {
                if (data.id == id) {
                    if (select.checked == true) {
                        data.permissions.push(permission);
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                const data = { id, permissions: [] };
                if (select.checked == true) {
                    data.permissions.push(permission);
                }
                dataList.push(data);
            }
        });
        const API = $("[button-submit]").attr("button-submit");
        fetch(API, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataList }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code == 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: data.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else if (data.code == 500) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: data.message,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            });
    });
}
