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
        const key = $(this).data("acceptkey");
        $("#bidderIdAccept").val(key);
        $("#acceptBidderForm").submit();
    });

    $(".deny-bidder").on("click", function () {
        const key = $(this).data("denykey");
        $("#bidderIdDeny").val(key);
        $("#denyBidderForm").submit();
    });

    // Manage sellers
    $(".downgrade-seller").on("click", function () {
        const key = $(this).data("downgradekey");
        $("#sellerIdDowngrade").val(key);
        $("#downgradeSellerForm").submit();
    });

    // Manage categories
    $(".delete-cat").on("click", function () {
        const key = $(this).data("deletecat");
        $("#catDeleteId").val(key);
        $("#deleteCatForm").submit();
    });

    $(".update-cat").on("click", function () {
        const key = $(this).data("updatecat");
        $("#catUpdateId").val(key);

        const currentRow = $(this).closest("tr");
        const catName = currentRow.find("td")[1];

        // Enable edit
        $("#catNameUpdate").prop("disabled", false);
        $(".superCatListUpdate").prop("disabled", false);
        $("#saveUpdateCatBtn").prop("disabled", false);
        $("#cancelUpdateCatBtn").prop("disabled", false);

        $("#catNameUpdate").val(catName.textContent);
        $("#catNameUpdate").focus();
    });

    $("#cancelUpdateCatBtn").on("click", function () {
        $("#catUpdateId").val("");
        $("#catNameUpdate").val("");
        $(".superCatListUpdate").val("");

        // Disable again
        $("#catNameUpdate").prop("disabled", true);
        $(".superCatListUpdate").prop("disabled", true);
        $("#saveUpdateCatBtn").prop("disabled", true);
        $("#cancelUpdateCatBtn").prop("disabled", true);
    });

    $('.admin-delete-product-form').on('submit', function (e) {
        e.preventDefault();
        Swal.fire({
            title: 'Warning',
            titleText: 'Delete a product',
            html: '<p>All the related information will also be be deleted.</p>' +
            '<p>Do you want to continue?</p>',
            icon: 'warning',
            confirmButtonText: 'OK',
            denyButtonText: 'Cancel',
            showDenyButton: true,
            confirmButtonColor: '#6963ff'
        }).then((result) => {
            if (result.isConfirmed) {
                this.submit();
            }
        })
    })

    $("#user-reset-pw-form").on('submit', function (e) {
        e.preventDefault();
        Swal.fire({
            title: 'Warning',
            titleText: 'Reset password',
            html: '<p>The password of this account will be reset to default.</p>' +
            '<p>Do you want to continue?</p>',
            icon: 'warning',
            confirmButtonText: 'OK',
            denyButtonText: 'Cancel',
            showDenyButton: true,
            confirmButtonColor: '#6963ff'
        }).then((result) => {
            if (result.isConfirmed) {
                this.submit();
            }
        })
    })

    document.querySelectorAll(`[data-mdb-toggle="tooltip"]`).forEach((t) => {
        new mdb.Tooltip(t, {
            container: "body",
            placement: "auto",
        });
    });

    if (location.pathname.match("/admin/categories")) {
        loadCategoryForDataList();
    }
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
    $("#web-logo").attr("src", "/images/logo_auction_v3_reverse_v2.png");
    $("#main").css("margin-left", "var(--siderbar-width)");
}

function closeSidebar() {
    localStorage.setItem("ad-sidebar", "close");
    $(".sidebar").addClass("collapsed");
    $("#web-logo").attr("src", "/images/logo_auction_v3_compact.png");
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

function loadCategoryForDataList() {
    $.getJSON("/api/admin/categories/datalist", function (data) {
        if (data.status === 200) {
            $(".superCatList").empty();
            $(".superCatListUpdate").empty();
            const options = data.data.map((d) => {
                return `<option value="${d.cat_id}">${d.cat_name}</option>`;
            });

            options.unshift(`<option value="">Choose a super category</option>`);

            $(".superCatList").html(options);
            $(".superCatListUpdate").html(options);
        } else if (data.status === 500) {
            alert("Something went wrong");
            return;
        }
    });
}
