$(document).ready(function () {
    const navbar = $("#navbar");
    $(document).scroll(function () {
        if (window.scrollY > 100) {
            navbar.addClass("navbar-scrolled");
        } else {
            navbar.removeClass("navbar-scrolled");
        }
    });

    $('[data-toggle="tooltip"]').tooltip();

    document.querySelectorAll(".form-outline").forEach((formOutline) => {
        new mdb.Input(formOutline).init();
    });

    $(".back-to-top").on("click", function () {
        window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    });

    $(document).scroll(function () {
        const scrollY = window.scrollY;

        if (scrollY > 500) $(".back-to-top").addClass("showbtn");
        else $(".back-to-top").removeClass("showbtn");
    });

    $("#toggle-filter-btn").on("click", function () {
        // Show modal
        $(".custom-modal-backdrop").addClass("show");
        $("#filterModal").addClass("show");
    });

    $("#filterModalDialog").on("click", function (e) {
        const clientX = e.clientX;
        const contentWidth = $("#filterModalContent").width();

        if (clientX <= contentWidth) {
            return;
        }

        closeFilterModal();
    });

    $("#btn-close-modal").on("click", function () {
        closeFilterModal();
    });

    function closeFilterModal() {
        $("#filterModalDialog").addClass("animate__slideOutLeft");
        $(".custom-modal-backdrop").removeClass("show");

        setTimeout(() => {
            $("#filterModal").removeClass("show");
            $("#filterModalDialog").removeClass("animate__slideOutLeft");
        }, 500);
    }

    document.querySelectorAll(`[data-mdb-toggle="tooltip"]`).forEach((t) => {
        new mdb.Tooltip(t, {
            container: "body",
            placement: "bottom",
        });
    });
});
