import { sweetAlert } from "./helper/alert.helper.js";
import { createAction, editActionSubmit } from "./helper/action.helper.js";

createAction();
editActionSubmit();

const updated = sessionStorage.getItem("updated");
const msg = sessionStorage.getItem("msg");
window.onload = () => {
    if (updated && msg) {
        sweetAlert(updated, msg, 2000);
        sessionStorage.clear("updated");
        sessionStorage.clear("msg");
    }
};

const url = new URL(window.location.href);
// LOAD PAGE
// add class active to filter btn
const clickedBtn = document.querySelector(
    `[filter-status="${url.searchParams.get("status") || ""}"]`
);
if (clickedBtn) {
    clickedBtn.classList.add("active");
}
// end

// Filter status
const listFilterStatus = document.querySelectorAll("[filter-status]");
if (listFilterStatus) {
    listFilterStatus.forEach((button) => {
        // click event
        const status = button.getAttribute("filter-status");
        button.addEventListener("click", () => {
            // set default page
            url.searchParams.delete("page");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}
// End Filter status

// Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputValue = e.target.querySelector("input").value;
        url.searchParams.set("keyword", inputValue);
        window.location.href = url.href;
    });
}
// end form search

// Pagination
const pageBtn = document.querySelectorAll("[page]");
if (pageBtn) {
    pageBtn.forEach((page) => {
        page.addEventListener("click", () => {
            url.searchParams.set("page", page.getAttribute("page"));
            window.location.href = url.href;
        });
    });
}

// Show alert
const showAlert = document.querySelector(".show-alert");
if (showAlert) {
    let time = showAlert.getAttribute("show-alert") || 2000;
    time = parseInt(time);
    setTimeout(() => {
        showAlert.classList.add("hidden");
    }, time);
}
// End show alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector(
        "[upload-image-preview]"
    );
    uploadImageInput.addEventListener("change", () => {
        const file = uploadImageInput.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End Upload Image

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);

    const select = sort.querySelector("[sort-select]");
    select.addEventListener("change", () => {
        const [sortKey, sortValue] = select.value.split("-");

        if (sortKey && sortValue) {
            url.searchParams.set("sortKey", sortKey);
            url.searchParams.set("sortValue", sortValue);

            window.location.href = url.href;
        }
    });

    // Thêm selected mặc định cho option
    const defaultSortKey = url.searchParams.get("sortKey");
    const defaultSortValue = url.searchParams.get("sortValue");

    if (defaultSortKey && defaultSortValue) {
        const optionSelected = select.querySelector(
            `option[value="${defaultSortKey}-${defaultSortValue}"]`
        );
        optionSelected.selected = true;
    }

    // Tính năng clear
    const buttonClear = sort.querySelector("[sort-clear]");
    if (buttonClear) {
        buttonClear.addEventListener("click", () => {
            url.searchParams.delete("sortKey");
            url.searchParams.delete("sortValue");

            window.location.href = url.href;
        });
    }
}
// End Sort
