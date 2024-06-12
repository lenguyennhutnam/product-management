const url = new URL(window.location.href);

// Filter status
const listFilterStatus = document.querySelectorAll("[filter-status]");
listFilterStatus.forEach((button) => {
    // click event
    // const url = new URL(window.location.href);
    const status = button.getAttribute("filter-status");
    // console.log(url.searchParams.get(status));
    button.addEventListener("click", () => {
        if (status) {
            url.searchParams.set("status", status);
        } else {
            url.searchParams.delete("status");
        }
        window.location.href = url.href;
        // console.log(url.href);
    });
});
// add class active
const clickedBtn = document.querySelector(
    `[filter-status="${url.searchParams.get("status") || ""}"]`
);
if (clickedBtn) {
    clickedBtn.classList.add("active");
}
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
