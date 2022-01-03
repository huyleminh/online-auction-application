$(document).ready(function () {
    activateSidebar();

    document.querySelectorAll(".form-outline").forEach((formOutline) => {
        new mdb.Input(formOutline).init();
    });

    $("#toggleBtn").on("click", function () {
        // if ($(document).width() > 576) {
        //     if ($(".sidebar").hasClass("collapsed")) {
        //         openSidebar();
        //     } else {
        //         closeSidebar();
        //     }
        // } else {
        //     if (!$(".sidebar").hasClass("hide")) {
        //         $(".custom-modal-backdrop").addClass("show");
        //         $("#adSidebarModal").addClass("show");
        //     } else {
        //         closeAdSidebarModal();
        //     }
        // }

        if ($(".sidebar").hasClass("collapsed")) {
            openSidebar();
        } else {
            closeSidebar();
        }
    });

    $("#adSidebarModal").on("click", function (e) {
        const clientX = e.clientX;
        const contentWidth = $("#adSidebarModal").width();

        if (clientX <= contentWidth) {
            return;
        }

        closeAdSidebarModal();
    });

    $("#btn-close-modal").on("click", function () {
        closeFilterModal();
    });

    // Manage bidders
    $(".accept-bidder").on("click", function () {
        const key = $(".accept-bidder").data("acceptkey");
        $("#bidderIdAccept").val(key);
        $("#acceptBidderForm").submit();
    });

    $(".deny-bidder").on("click", function () {
        const key = $(".deny-bidder").data("denykey");
        $("#bidderIdDeny").val(key);
        $("#denyBidderForm").submit();
    });

    // Manage sellers
    $(".downgrade-seller").on("click", function () {
        const key = $(".downgrade-seller").data("downgradekey");
        $("#sellerIdDowngrade").val(key);
        $("#downgradeSellerForm").submit();
    });

    // Manage categories
    $(".delete-cat").on("click", function () {
        const key = $(".delete-cat").data("deletecat");
        $("#catDeleteId").val(key);
        $("#deleteCatForm").submit();
    });

    $(".update-cat").on("click", function () {
        const key = $(".update-cat").data("updatecat");
        $("#catUpdateId").val(key);

        const currentRow = $(this).closest("tr");
        const catName = currentRow.find("td")[1];

        // Enable edit
        $("#catNameUpdate").prop("disabled", false);
        $("#superCatUpdate").prop("disabled", false);
        $("#saveUpdateCatBtn").prop("disabled", false);
        $("#cancelUpdateCatBtn").prop("disabled", false);

        $("#catNameUpdate").val(catName.textContent);
        $("#catNameUpdate").focus();
    });

    $("#cancelUpdateCatBtn").on("click", function() {
        $("#catUpdateId").val("");
        $("#catNameUpdate").val("");
        $("#superCatUpdate").val("");

        // Disable again
        $("#catNameUpdate").prop("disabled", true);
        $("#superCatUpdate").prop("disabled", true);
        $("#saveUpdateCatBtn").prop("disabled", true);
        $("#cancelUpdateCatBtn").prop("disabled", true);
    })

    document.querySelectorAll(`[data-mdb-toggle="tooltip"]`).forEach((t) => {
        new mdb.Tooltip(t, {
            container: "body",
            placement: "auto",
        });
    });
});

function closeAdSidebarModal() {
    $("#adSidebarModal").addClass("animate__slideOutLeft");
    $(".custom-modal-backdrop").removeClass("show");

    setTimeout(() => {
        $("#filterModal").removeClass("show");
        $("#filterModalDialog").removeClass("animate__slideOutLeft");
    }, 500);
}

function openSidebar() {
    localStorage.setItem("ad-sidebar", "open");
    $(".sidebar").removeClass("collapsed");
    $("#main").css("margin-left", "var(--siderbar-width)");
}

function closeSidebar() {
    localStorage.setItem("ad-sidebar", "close");
    $(".sidebar").addClass("collapsed");
    $("#main").css("margin-left", "var(--siderbar-sm-width)");
}

function activateSidebar() {
    // Activate active link
    const activeHref = location.pathname + location.hash;

    const navItems = document.querySelectorAll(".menu-item");
    navItems.forEach(function (item) {
        const navLink = item.children[0];
        const href = navLink.attributes["href"];

        if (activeHref === href.value) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    const sidebarStatus = localStorage.getItem("ad-sidebar") || "open";
    switch (sidebarStatus) {
        case "open":
            openSidebar();
            break;
        case "close":
            closeSidebar();
            break;
        default:
            openSidebar();
            break;
    }
}
