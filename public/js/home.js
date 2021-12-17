$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,

        items: 3,
        loop: true,
        center: false,
        rewind: false,

        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        freeDrag: false,

        margin: 0,
        stagePadding: 0,
        merge: false,
        mergeFit: true,
        autoWidth: false,

        startPosition: 0,
        smartSpeed: 250,
        fluidSpeed: false,
        dragEndSpeed: false,

        responsive: {
            0: { items: 1, nav: true },
            480: { items: 2, nav: true },
            768: { items: 2, nav: true, loop: true },
            992: { items: 3, nav: true, loop: true },
            1400: { items: 4, nav: true, loop: true },
            1920: { items: 4, nav: true, loop: true },
        },

        // responsiveRefreshRate: 300,
        // fallbackEasing: "swing",
        // info: false,
        // nestedItemSelector: false,
        // itemElement: "div",
        // stageElement: "div",
        // refreshClass: "owl-refresh",
        // loadedClass: "owl-loaded",
        // loadingClass: "owl-loading",
        // rtlClass: "owl-rtl",
        // responsiveClass: "owl-responsive",
        // dragClass: "owl-drag",
        // itemClass: "owl-item",
        // stageClass: "owl-stage",
        // stageOuterClass: "owl-stage-outer",
        // grabClass: "owl-grab",
        // autoHeight: false,
        // lazyLoad: false,
    });
});