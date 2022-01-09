const owlOption = {
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

    margin: 25,
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
        480: { items: 1, nav: true },
        768: { items: 2, nav: true, loop: true },
        992: { items: 3, nav: true, loop: true },
        1400: { items: 4, nav: true, loop: true },
        1920: { items: 4, nav: true, loop: true },
    },
};

$(document).ready(function () {
    $(".owl-carousel").owlCarousel(owlOption);
    loadTop5Due();
    loadTop5Highest();
    loadTop5Bid();
});

function loadTop5Due() {
    $.getJSON("/api/home/top5due", function (data) {
        if (data.status === 200) {
            const list = data.data;

            const cardList = list.map((item) => {
                let buyNow;
                if (item.buyNowPrice === undefined) {
                    buyNow = "N/A";
                } else {
                    buyNow = `${item.buyNowPrice} VND`;
                }

                let expType;
                if (item.dayDiff > 7) {
                    expType = "timer-success";
                } else if (item.dayDiff > 3) {
                    expType = "timer-warning";
                } else {
                    expType = "timer-danger";
                }

                return `
                    <div class="card product-card">
                        <div class="p-3">
                            <a href="/menu/products/${item.productId}" class="card-image" style="max-height: 250px; height: 250px">
                                <img
                                    src=${item.thumbnail}
                                    class="img-fluid"
                                    style="height: 100%; object-fit: contain"
                                />
                                <div class="mask">
                                    <span><i class="fas fa-search-plus me-1"></i>View details</span>
                                </div>
                            </a>
                        </div>

                        <div class="card-body p-3 d-flex flex-column justify-content-between">
                            <h4 class="card-title" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">${item.productName}</h4>
                            <div class="card-info">
                                <div class="card-info mb-3 d-flex align-items-center bid">
                                    <i class="fas fa-gavel text-success"></i>
                                    <span class="text-success">Current Bid</span>
                                    <span class="flex-grow-1 text-end">${item.currentPrice} VND</span>
                                </div>
                                <div class="card-info mb-3 d-flex align-items-center">
                                    <i class="fas fa-dollar-sign text-danger"></i>
                                    <span class="text-danger">Buy Now</span>
                                    <span class="flex-grow-1 text-end">${buyNow}</span>
                                </div>
                                <div class="card-info mb-3 d-flex align-items-center">
                                    <i class="fas fa-crown text-warning"></i>
                                    <span class="text-warning">Top Bidder:</span>
                                    <span class="flex-grow-1 text-end">${item.firstName}</span>
                                </div>
                                <div
                                    class="card-info mb-3 d-flex align-items-center timer"
                                >
                                    <span class="${expType} fw-bolder">Expired ${item.expiredDate}</span>
                                    <span class="flex-grow-1 text-end">${item.totalBids} Bids</span>
                                </div>
                                <a href="/menu/products/${item.productId}" type="button" class="btn btn-primary btn-block bidnow">
                                    <i class="fas fa-gavel me-2"></i>
                                    Go to bid page
                                </a>
                            </div>
                        </div>
                        <div class="card-footer text-center p-3">
                            <p class="m-0 verical-align-middle">Posted ${item.createdDate}</p>
                        </div>
                    </div>
                `;
            });

            $("#topDue").trigger("destroy.owl.carousel"); //these 3 lines kill the owl, and returns the markup to the initial state
            $("#topDue").find(".owl-stage-outer").children().unwrap();
            $("#topDue").removeClass("owl-center owl-loaded owl-text-select-on");
            $("#topDue").html(cardList.join(""));
            $("#topDue").owlCarousel(owlOption);
        }
    });
}

function loadTop5Highest() {
    $.getJSON("/api/home/top5highest", function (data) {
        if (data.status === 200) {
            const list = data.data;

            const cardList = list.map((item) => {
                let buyNow;
                if (item.buyNowPrice === undefined) {
                    buyNow = "N/A";
                } else {
                    buyNow = `${item.buyNowPrice} VND`;
                }

                let expType;
                if (item.dayDiff > 7) {
                    expType = "timer-success";
                } else if (item.dayDiff > 3) {
                    expType = "timer-warning";
                } else {
                    expType = "timer-danger";
                }

                const ribbon = item.isSold ? `<div class="ribbon bg-danger">SOLD</div>` : "";

                return `
                    <div class="card product-card">
                        <div class="p-3 postion-relative">
                            ${ribbon}
                            <a href="/menu/products/${item.productId}" class="card-image" style="max-height: 250px; height: 250px">
                                <img
                                    src=${item.thumbnail}
                                    class="img-fluid"
                                    style="height: 100%; object-fit: contain"
                                />
                                <div class="mask">
                                    <span><i class="fas fa-search-plus me-1"></i>View details</span>
                                </div>
                            </a>
                        </div>

                        <div class="card-body p-3 d-flex flex-column justify-content-between">
                            <h4 class="card-title" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">${item.productName}</h4>
                            <div class="card-info">
                                <div class="card-info mb-3 d-flex align-items-center bid">
                                    <i class="fas fa-gavel text-success"></i>
                                    <span class="text-success">Current Bid</span>
                                    <span class="flex-grow-1 text-end">${item.currentPrice} VND</span>
                                </div>
                                <div class="card-info mb-3 d-flex align-items-center">
                                    <i class="fas fa-dollar-sign text-danger"></i>
                                    <span class="text-danger">Buy Now</span>
                                    <span class="flex-grow-1 text-end">${buyNow}</span>
                                </div>
                                <div class="card-info mb-3 d-flex align-items-center">
                                    <i class="fas fa-crown text-warning"></i>
                                    <span class="text-warning">Top Bidder:</span>
                                    <span class="flex-grow-1 text-end">${item.firstName}</span>
                                </div>
                                <div
                                    class="card-info mb-3 d-flex align-items-center timer"
                                >
                                    <span class="${expType} fw-bolder">Expired ${item.expiredDate}</span>
                                    <span class="flex-grow-1 text-end">${item.totalBids} Bids</span>
                                </div>
                                <a href="/menu/products/${item.productId}" type="button" class="btn btn-primary btn-block bidnow">
                                    <i class="fas fa-gavel me-2"></i>
                                    Go to bid page
                                </a>
                            </div>
                        </div>
                        <div class="card-footer text-center p-3">
                            <p class="m-0 verical-align-middle">Posted ${item.createdDate}</p>
                        </div>
                    </div>
                `;
            });

            $("#topHigh").trigger("destroy.owl.carousel"); //these 3 lines kill the owl, and returns the markup to the initial state
            $("#topHigh").find(".owl-stage-outer").children().unwrap();
            $("#topHigh").removeClass("owl-center owl-loaded owl-text-select-on");
            $("#topHigh").html(cardList.join(""));
            $("#topHigh").owlCarousel(owlOption);
        }
    });
}

function loadTop5Bid() {
    $.getJSON("/api/home/top5bid", function (data) {
        if (data.status === 200) {
            const list = data.data;

            const cardList = list.map((item) => {
                let buyNow;
                if (item.buyNowPrice === undefined) {
                    buyNow = "N/A";
                } else {
                    buyNow = `${item.buyNowPrice} VND`;
                }

                let expType;
                if (item.dayDiff > 7) {
                    expType = "timer-success";
                } else if (item.dayDiff > 3) {
                    expType = "timer-warning";
                } else {
                    expType = "timer-danger";
                }

                const ribbon = item.isSold ? `<div class="ribbon bg-danger">SOLD</div>` : "";

                return `
                    <div class="card product-card">
                        <div class="p-3 position-relative">
                            ${ribbon}
                            <a href="/menu/products/${item.productId}" class="card-image" style="max-height: 250px; height: 250px">
                                <img
                                    src=${item.thumbnail}
                                    class="img-fluid"
                                    style="height: 100%; object-fit: contain"
                                />
                                <div class="mask">
                                    <span><i class="fas fa-search-plus me-1"></i>View details</span>
                                </div>
                            </a>
                        </div>

                        <div class="card-body p-3 d-flex flex-column justify-content-between">
                            <h4 class="card-title" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">${item.productName}</h4>
                            <div class="card-info">
                                <div class="card-info mb-3 d-flex align-items-center bid">
                                    <i class="fas fa-gavel text-success"></i>
                                    <span class="text-success">Current Bid</span>
                                    <span class="flex-grow-1 text-end">${item.currentPrice} VND</span>
                                </div>
                                <div class="card-info mb-3 d-flex align-items-center">
                                    <i class="fas fa-dollar-sign text-danger"></i>
                                    <span class="text-danger">Buy Now</span>
                                    <span class="flex-grow-1 text-end">${buyNow}</span>
                                </div>
                                <div class="card-info mb-3 d-flex align-items-center">
                                    <i class="fas fa-crown text-warning"></i>
                                    <span class="text-warning">Top Bidder:</span>
                                    <span class="flex-grow-1 text-end">****${item.firstName}</span>
                                </div>
                                <div
                                    class="card-info mb-3 d-flex align-items-center timer"
                                >
                                    <span class="${expType} fw-bolder">Expired ${item.expiredDate}</span>
                                    <span class="flex-grow-1 text-end">${item.totalBids} Bids</span>
                                </div>
                                <a href="/menu/products/${item.productId}" type="button" class="btn btn-primary btn-block bidnow">
                                    <i class="fas fa-gavel me-2"></i>
                                    Go to bid page
                                </a>
                            </div>
                        </div>
                        <div class="card-footer text-center p-3">
                            <p class="m-0 verical-align-middle">Posted ${item.createdDate}</p>
                        </div>
                    </div>
                `;
            });

            $("#topBidded").trigger("destroy.owl.carousel"); //these 3 lines kill the owl, and returns the markup to the initial state
            $("#topBidded").find(".owl-stage-outer").children().unwrap();
            $("#topBidded").removeClass("owl-center owl-loaded owl-text-select-on");
            $("#topBidded").html(cardList.join(""));
            $("#topBidded").owlCarousel(owlOption);
        }
    });
}
