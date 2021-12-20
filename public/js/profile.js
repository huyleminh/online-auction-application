$(document).ready(function () {
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
});

function closeProfileModal() {
    $("#profileModalDialog").addClass("animate__slideOutLeft");
    $(".custom-modal-backdrop").removeClass("show");

    setTimeout(() => {
        $("#profileModal").removeClass("show");
        $("#profileModalDialog").removeClass("animate__slideOutLeft");
    }, 500);
}
