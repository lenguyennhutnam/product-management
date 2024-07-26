export function sweetAlert(type, msg, time) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: time || 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });
    Toast.fire({
        icon: type,
        title: msg,
    });
}

export function fireAlert(code, msg) {
    if (code == 200 && msg) {
        sessionStorage.setItem("updated", "success");
        sessionStorage.setItem("msg", msg);
    } else if (code == 500) {
        sessionStorage.setItem("updated", "error");
        sessionStorage.setItem("msg", msg);
    }
    window.location.reload();
}
