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

    $("#filterProdForm").on("submit", function (e) {
        e.preventDefault();

        const formValues = $(this).serializeArray();
        const params = new URLSearchParams(new URL(location.href).search);

        formValues.forEach((field) => {
            params.set(field.name, field.value);
        });

        location.assign(`?${params.toString()}`);
        return;
    });

    $(".page-link-custom").on("click", function () {
        const page = $(this).data("href");
        if (page === undefined) {
            return;
        }

        $("#filterPage").val(page);
        $("#filterProdForm").submit();
    });

    if (location.pathname.match("/menu/categories")) {
        loadCatFilter();
    }
});

function loadCatFilter() {
    $.getJSON("/api/menu/categories", function (data) {
        if (data.status === 200) {
            const ul = $(".filterCatList");

            const mappedCat = data.data
                .map((cat) => {
                    const children = cat.children
                        .map((child) => {
                            return `
                        <li class="list-group-item categories-item">
                            <a href="${child.cat_id}">
                                <span>${child.cat_name}</span>
                            </a>
                        </li>
                    `;
                        })
                        .join("");

                    return `
                    <li class="list-group-item border-start-0 border-end-0 categories-item">
                        <a href="#">
                            <span>${cat.rootName}</span>
                            <i class="fas fa-chevron-right"></i>
                        </a>

                        <ul class="list-group rounded-2 categories-subgroup">
                            ${children}
                        </ul>
                    </li>
                `;
                })
                .join("");

            ul.html(`
                <li class="list-group-item border-start-0 border-end-0 categories-item">
                    <a href="all">
                        <span>View all categories</span>
                    </a>
                </li>
                ${mappedCat}
            `);
        }
    });
}
