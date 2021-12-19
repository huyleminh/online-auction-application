$(document).ready(function () {
    initActiveLink();
    $(".nav-item").on("click", function () {
        $(".nav-item.active").removeClass("active");
        $(this).addClass("active");
    });
});

function initActiveLink() {
    const activeHref = location.pathname + location.hash;

    const navItems = document.querySelectorAll(".nav-item.nav-item-header");
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
