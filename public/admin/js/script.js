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
// End Filter status

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

// Change status
const changeStatusBtns = document.querySelectorAll("[change-status-btn]");
changeStatusBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const productId = btn.closest("tr").getAttribute("product-id");
        const API = `/admin/products/change-status/${productId}`;
        fetch(API, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code == 200) {
                    window.location.reload();
                }
            });
    });
});
// End change status

// Change multi status
const activeAllBtn = document.querySelector("input[name='activeAll']");
const isActiveBtns = document.querySelectorAll("input[name='isActive']");
const updateMultiStatusBtn = document.querySelector(
    "button[update-multi-status-btn]"
);
// active all event
activeAllBtn.addEventListener("change", (e) => {
    isActiveBtns.forEach((btn) => {
        btn.checked = e.target.checked;
    });
});
// check active event
isActiveBtns.forEach((btn) => {
    btn.addEventListener("change", (e) => {
        const isActiveBtnChecked = document.querySelectorAll(
            "input[name='isActive']:checked"
        );
        if (isActiveBtnChecked.length == isActiveBtns.length) {
            activeAllBtn.checked = true;
        } else {
            activeAllBtn.checked = false;
        }
    });
});
// update multi status btn
updateMultiStatusBtn.addEventListener("click", (e) => {
    const isActiveBtnChecked = document.querySelectorAll(
        "input[name='isActive']:checked"
    );
    const checkedId = Array.from(isActiveBtnChecked).map((btn) => {
        console.log(btn.closest("tr").getAttribute("product-id"));
        return btn.closest("tr").getAttribute("product-id");
    });
    console.log(checkedId);
});
// End change multi status
