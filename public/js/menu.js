$(document).ready(function () {
    $(".card-images-preview").owlCarousel({
        items: 3,
        center: true,

        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        freeDrag: false,

        margin: 10,
        stagePadding: 0,
        merge: false,
        mergeFit: true,
        autoWidth: false,

        startPosition: 0,
        smartSpeed: 250,
        fluidSpeed: false,
        dragEndSpeed: false,

        responsive: {
            0: { items: 1, loop: true },
            480: { items: 2, loop: true },
            768: { items: 2, loop: true },
            992: { items: 3, loop: true },
            1400: { items: 3, loop: true },
            1920: { items: 3, loop: true },
        },
    });

    $(".product-related-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,

        items: 3,
        center: true,

        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        freeDrag: false,

        margin: 25,
        stagePadding: 10,
        merge: false,
        mergeFit: true,
        autoWidth: false,

        startPosition: 0,
        smartSpeed: 250,
        fluidSpeed: false,
        dragEndSpeed: false,

        responsive: {
            0: { items: 1, loop: true },
            480: { items: 2, loop: true },
            768: { items: 2, loop: true },
            992: { items: 3, loop: true },
            1400: { items: 3, loop: true },
            1920: { items: 3, loop: true },
        },
    });

    $("#btn-share").on("click", function () {
        const link = location.href;
        $("#copy-text").html("");

        $("#shareLinkHolder").attr("value", link);
        $("#shareLinkHolder").html(link);

        $("#btn-copy").on("click", function () {
            navigator.clipboard.writeText(link).then(() => {
                $("#copy-text").html("Link coppied to clipboard");
            });
        });
    });

    // Change image
    $(".related-images").click(function () {
        const src = $(this).attr("src");
        $("#main-image").attr("src", src);
    });

    $("#hidBidPriceForm").on("submit", function (e) {
        e.preventDefault();

        const money = $("#money").val();

        Swal.fire({
            title: `Bid with ${money} VND`,
            text: "Once you confirm, our system will save this price and start automation bidding for you",
            icon: "info",
            confirmButtonText: "Ok",
            confirmButtonColor: "#6963ff",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            cancelButtonColor: "#f82b89",
        }).then((result) => {
            if (result.isConfirmed) {
                return $("#hidBidPriceForm").off("submit").submit();
            }
        });
    });
});
