const intervalIdList = [];

$(document).ready(function () {
    if ($(".countdown")) {
        activeCountDownTimer();
    }

    function activeCountDownTimer() {
        document.querySelectorAll(".countdown").forEach(function (item) {
            const date = item.textContent;

            let countDownDate = new Date(date).getTime();
            let countId = setInterval(function () {
                // Get today's date and time
                let now = new Date().getTime();

                // Find the distance between now and the count down date
                let distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (days > 7) {
                    item.classList.remove("timer-danger");
                    item.classList.remove("timer-warning");
                    item.classList.add("timer-success");
                } else if (days > 3) {
                    item.classList.remove("timer-danger");
                    item.classList.add("timer-warning");
                    item.classList.remove("timer-success");
                } else {
                    item.classList.add("timer-danger");
                    item.classList.remove("timer-warning");
                    item.classList.remove("timer-success");
                }

                // Output the result in an element with id="demo"
                // console.log(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                const countString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                item.innerHTML = countString;

                // If the count down is over, write some text
                if (distance < 0) {
                    countId && clearInterval(countId);
                    item.classList.add("timer-danger");
                    item.innerHTML("EXPIRED");
                }
            }, 1000);

            intervalIdList.push(countId);
        });
    }

    $(window).bind("beforeunload", function () {
        // intervalIdList.forEach((id) => id && clearInterval(id));
    });
});
