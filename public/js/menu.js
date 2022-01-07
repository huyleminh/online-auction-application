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
});
