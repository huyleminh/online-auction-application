$(document).ready(function () {
    activeProfileBar();
    $("#toggle-profile-btn").on("click", function () {
        // Show modal
        $(".custom-modal-backdrop").addClass("show");
        $("#profileModal").addClass("show");
    });

    $("#profileModalDialog").on("click", function (e) {
        const clientX = e.clientX;
        const contentWidth = $("#profileModalContent").width();

        if (clientX <= contentWidth) {
            return;
        }

        closeProfileModal();
    });

    $("#btn-close-modal").on("click", function () {
        closeProfileModal();
    });

    $("#updateEmaileForm").on("submit", async function (e) {
        e.preventDefault();

        const email = $("#email").val();

        const response = await fetch("/user/account/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: { email },
        });

        if (response.ok && response.status === 200) {
            $("#newEmail").val(email);
            $("#confirmOTP").modal("show");
        } else {
            alert("Some thing went wrong, please try again latter");
        }
        return;
    });

    $("#updatePassForm").on("submit", function (e) {
        e.preventDefault();

        const curr = $("#password").val();
        const newPass = $("#newPassword").val();

        if (curr === newPass) {
            alert("New password cannot as same as the old one");
            return;
        }

        const confirmNewPass = $("#confirm").val();
        if (newPass !== confirmNewPass) {
            alert("Confirm password does not match");
            return;
        }

        $("#updatePassForm").off("submit").submit();
    });

    // Submit profile form
    // $("#profileForm").on("submit", function (e) {
    //     e.preventDefault();

    //     const dob = $("#dob").val();
    //     $("#dob").val(moment(dob, "DD-MM-YYYY").format("YYYY-MM-DD"));

    //     $("#profileForm").off("submit").submit();
    // });

    // Init dob datepicker
    // Need to fix
    // if (document.querySelector("#dob")) {
    //     const dobDialog = new mdDateTimePicker.default({
    //         type: "date",
    //     });

    //     dobDialog.trigger = document.querySelector("#dob");

    //     document.querySelector("#dob").addEventListener("onOk", function () {
    //         // Detail format option here: https://momentjs.com/docs/#/displaying/format/
    //         this.value = dobDialog.time.format("DD/MM/YYYY");
    //         // Hide backdrop
    //         $(".custom-modal-backdrop").removeClass("show");
    //     });

    //     document.querySelector("#dob").addEventListener("onCancel", function () {
    //         // Detail format option here: https://momentjs.com/docs/#/displaying/format/
    //         // Hide backdrop
    //         $(".custom-modal-backdrop").removeClass("show");
    //     });

    //     $("#dob").on("click", function () {
    //         toggleDatepickerDialog(dobDialog);
    //     });
    // }
    $(".remove-wishlist-item").on("click", function () {
        const key = $(".remove-wishlist-item").data("removekey");
        $("#itemId").val(key);
        $("#deleteWishlistItem").submit();
    });

    $(".feedback-btn").on("click", function () {
        $("#feedbackModal").modal("toggle");
        $("#ratedId").val(this.dataset.ratedId)
    });

    $("#positive").on("click", function () {
        $("#thumbsup").removeClass("far");
        $("#thumbsup").addClass("fas");

        $("#thumbsdown").removeClass("fas");
        $("#thumbsdown").addClass("far");
    });

    $("#negative").on("click", function () {
        $("#thumbsdown").removeClass("far");
        $("#thumbsdown").addClass("fas");

        $("#thumbsup").removeClass("fas");
        $("#thumbsup").addClass("far");
    });
});

function closeProfileModal() {
    $("#profileModalDialog").addClass("animate__slideOutLeft");
    $(".custom-modal-backdrop").removeClass("show");

    setTimeout(() => {
        $("#profileModal").removeClass("show");
        $("#profileModalDialog").removeClass("animate__slideOutLeft");
    }, 500);
}

function toggleDatepickerDialog(dialog) {
    dialog.toggle();
    // Show backdrop
    $(".custom-modal-backdrop").addClass("show");
}

function activeProfileBar() {
    const activeHref = location.pathname + location.hash;

    const navItems = document.querySelectorAll(".profile-bar-item");
    navItems.forEach(function (item) {
        const navLink = item.children[0];
        const href = navLink.attributes["href"];

        if (activeHref === href.value) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}
