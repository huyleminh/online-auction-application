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
});
