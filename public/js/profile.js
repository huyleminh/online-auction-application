$(document).ready(function () {
    activeProfileBar();
    $("#toggle-profile-btn").on("click", function () {
        // Show modal
        $(".custom-modal-backdrop").addClass("show");
        $("#profileModal").addClass("show");
    });

    $("#profileModalDialog").on("click", function (e) {
        const clientX = e.clientX;
        const contentWidth = $("#profileModalContent").width();

        if (clientX <= contentWidth) {
            return;
        }

        closeProfileModal();
    });

    $("#btn-close-modal").on("click", function () {
        closeProfileModal();
    });

    $("#getOTPBtn").on("click", function () {
        const email = $("#email").val();
        if (!email) {
            alert("Please input contact email");
            return;
        }
        $("#emailtext").html("Sending OTP...");
        $("#emailtext").removeClass("text-danger");
        $("#emailtext").removeClass("text-success");

        $.post("/user/account/email/send", { email }, function (data) {
            if (data.status === 200) {
                $("#otpCode").prop("disabled", false);
                $("#emailtext").html(
                    "OTP code has been sent to your email, it will expire soon. Please enter in the input below. If you cannot receive OTP, click GET OTP again"
                );
                $("#emailtext").addClass("text-success");
                $("#emailtext").removeClass("text-danger");
            } else if (data.status === 400) {
                $("#otpCode").prop("disabled", true);
                $("#emailtext").html(data.message);
                $("#emailtext").addClass("text-danger");
            } else {
                console.log(data);
                $("#otpCode").prop("disabled", true);
                $("#emailtext").html("Something went wrong, please get OTP code later");
                $("#emailtext").addClass("text-danger");
            }
        });
    });

    $("#updatePassForm").on("submit", function (e) {
        e.preventDefault();

        const curr = $("#password").val();
        const newPass = $("#newPassword").val();

        if (curr === newPass) {
            $("#newPasswordText").addClass("text-danger");
            return;
        }
        $("#newPasswordText").removeClass("text-danger");

        const confirmNewPass = $("#confirm").val();
        if (newPass !== confirmNewPass) {
            $("#confirmNewPasswordText").addClass("text-danger");
            $("#confirmNewPasswordText").html("Confirm password does not match");
            return;
        }
        $("#confirmNewPasswordText").removeClass("text-danger");

        $("#updatePassForm").off("submit").submit();
    });

    $(".remove-wishlist-item").on("click", function () {
        const key = $(".remove-wishlist-item").data("removekey");
        $("#itemId").val(key);
        $("#deleteWishlistItem").submit();
    });

    $(".feedback-btn").on("click", function () {
        $("#feedbackModal").modal("toggle");
        $("#ratedId").val(this.dataset.ratedId);
    });

    $("#positive").on("click", function () {
        $("#thumbsup").removeClass("far");
        $("#thumbsup").addClass("fas");

        $("#thumbsdown").removeClass("fas");
        $("#thumbsdown").addClass("far");
    });

    $("#negative").on("click", function () {
        $("#thumbsdown").removeClass("far");
        $("#thumbsdown").addClass("fas");

        $("#thumbsup").removeClass("fas");
        $("#thumbsup").addClass("far");
    });

    // Catch change event for input image
    if ($("#detailImages")) {
        $("#detailImages").on("change", function (e) {
            const target = e.target;
            const fileLen = target.files.length;
            var flag = false;

            if (fileLen <= 0) {
                return;
            }

            if (fileLen < 3) {
                if ($("#warning-image-details").hasClass("d-none")) {
                    $("#warning-image-details").text("Please choose at least 3 images.");
                    $("#warning-image-details").removeClass("d-none");
                }
                flag = true;
            } else {
                if (!$("#warning-image-details").hasClass("d-none")) {
                    $("#warning-image-details").text("");
                    $("#warning-image-details").addClass("d-none");
                }
            }

            $("#preview-detail").html("");
            for (let i = 0; i < fileLen; ++i) {
                const file = target.files[i];
                if ([...file.type.matchAll(/^(image\/)\w*/g)].length === 0) {
                    if ($("#warning-image-details").hasClass("d-none")) {
                        $("#warning-image-details").text(
                            "Invalid file's type. Please choose again."
                        );
                        flag = true;
                        $("#preview-detail").html("");
                        $("#warning-image-details").removeClass("d-none");
                    }
                    return;
                } else {
                    if (!$("#warning-image-details").hasClass("d-none")) {
                        $("#warning-image-details").text("");
                        $("#warning-image-details").addClass("d-none");
                    }
                }
                let fileReader = new FileReader();

                fileReader.readAsDataURL(file);
                fileReader.onload = function () {
                    const url = fileReader.result;

                    let tmp = $("#preview-detail").html();

                    tmp += `
                        <div class="image-preview-item">
                            <img src=${url} alt="upload-image">
                        </div>
                    `;

                    $("#preview-detail").html(tmp);
                };
            }
            if (flag) {
                $("#detailImages").val("");
            }
        });
    }

    if ($("#thumbnailImg")) {
        $("#thumbnailImg").on("change", function (e) {
            const target = e.target;
            const fileLen = target.files.length;

            if (fileLen <= 0) {
                return;
            }

            const file = target.files[0];
            if ([...file.type.matchAll(/^(image\/)\w*/g)].length === 0) {
                if ($("#warning-image-thumbnail").hasClass("d-none")) {
                    $("#warning-image-thumbnail").text("Invalid file's type. Please choose again.");
                    $("#thumbnailImg").val("");
                    $("#preview-thumbnail").html("");
                    if ($("#upload-thumbnail").hasClass("opacity-0")) {
                        $("#upload-thumbnail").removeClass("opacity-0");
                    }
                    $("#warning-image-thumbnail").removeClass("d-none");
                }
                return;
            } else {
                if (!$("#warning-image-thumbnail").hasClass("d-none")) {
                    $("#warning-image-thumbnail").text("");
                    $("#warning-image-thumbnail").addClass("d-none");
                }
            }
            let fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = function () {
                const url = fileReader.result;

                let tmp = `
                        <div class="image-preview-item position-absolute">
                            <img src=${url} alt="upload-image">
                        </div>
                    `;

                $("#preview-thumbnail").html("");
                $("#preview-thumbnail").html(tmp);
                if (!$("#upload-thumbnail").hasClass("opacity-0")) {
                    $("#upload-thumbnail").addClass("opacity-0");
                }
            };
        });
    }

    // Handle select category on the create product page
    if ($("#catSelected")) {
        $("#catSelected").on("change", function () {
            $("#prodCategory").val(this.value);
        });
    }

    // Validate images before submit
    // $("#saveProductBtn").submit(function (event) {
    //     if (!$("#warning-image-thumbnail").hasClass("d-none") || !$("#warning-image-details").hasClass("d-none")) {
    //         alert("Please check your information again.")
    //         event.preventDefault();
    //     }

    //     // if ($("#warning-image-details").hasClass("d-none")) {
    //     //     $("#warning-image-details").text("Please choose at least 3 images.");
    //     //     $("#warning-image-details").removeClass("d-none");
    //     // }
    // })

    // Init product expired date datepicker
    if (document.querySelector("#expiredDate")) {
        const expiredDateDialog = new mdDateTimePicker.default({
            type: "date",
            future: moment().add(10, "year"),
        });

        expiredDateDialog.trigger = document.querySelector("#expiredDate");

        document.querySelector("#expiredDate").addEventListener("onOk", function () {
            // Detail format option here: https://momentjs.com/docs/#/displaying/format/
            this.value = expiredDateDialog.time.format("DD/MM/YYYY");
            this.focus();

            // Hide backdrop
            $(".custom-modal-backdrop").removeClass("show");
        });

        document.querySelector("#expiredDate").addEventListener("onCancel", function () {
            // Detail format option here: https://momentjs.com/docs/#/displaying/format/
            // Hide backdrop
            $(".custom-modal-backdrop").removeClass("show");
        });

        $("#expiredDate").on("click", function () {
            toggleDatepickerDialog(expiredDateDialog);
        });
    }

    if (document.querySelector("#expiredTime")) {
        const expiredTimeDialog = new mdDateTimePicker.default({
            type: "time",
        });

        expiredTimeDialog.trigger = document.querySelector("#expiredTime");

        document.querySelector("#expiredTime").addEventListener("onOk", function () {
            // Detail format option here: https://momentjs.com/docs/#/displaying/format/
            this.value = expiredTimeDialog.time.format("HH:mm:ss");
            this.focus();

            // Hide backdrop
            $(".custom-modal-backdrop").removeClass("show");
        });

        document.querySelector("#expiredTime").addEventListener("onCancel", function () {
            // Detail format option here: https://momentjs.com/docs/#/displaying/format/
            // Hide backdrop
            $(".custom-modal-backdrop").removeClass("show");
        });

        $("#expiredTime").on("click", function () {
            toggleDatepickerDialog(expiredTimeDialog);
        });
    }

    // Profile information preparation
    if (window.location.pathname === "/user/account") {
        // fetchAllProvince();
        $.getJSON("https://provinces.open-api.vn/api/?depth=1", function (data) {
            const provinceList = data;
            insertOptionsToTarget($("#provinceList"), provinceList);

            // Prefetch district
            if (!$("#province").val()) {
                return;
            }
            const provinceOption = $("#provinceList").find(
                `option[value="${$("#province").val()}"]`
            );
            if (!provinceOption) {
                return;
            }
            const code = provinceOption.data("code");
            $.getJSON(`https://provinces.open-api.vn/api/p/${code}?depth=2`, function (res) {
                const districts = res.districts;
                insertOptionsToTarget($("#districtList"), districts);

                // Prefetch ward
                const disOption = $("#districtList").find(
                    `option[value="${$("#district").val()}"]`
                );
                if (!disOption) {
                    return;
                }
                const wardcode = disOption.data("code");
                $.getJSON(`https://provinces.open-api.vn/api/d/${wardcode}?depth=2`, function (res) {
                    const wards = res.wards;
                    insertOptionsToTarget($("#wardList"), wards);
                }).fail(function (error) {
                    console.log(error);
                    $("#provinceList").html("<option disabled value='Empty'>");
                });
            }).fail(function (error) {
                console.log(error);
                $("#provinceList").html("<option disabled value='Empty'>");
            });
        }).fail(function (error) {
            console.log(error);
            $("#provinceList").html("<option disabled value='Empty'>");
        });
    }

    $("#province").on("change", function () {
        const value = this.value;
        if (!value || !value.trim()) {
            return;
        }
        const option = $("#provinceList").find(`option[value="${value}"]`);
        if (!option) {
            return;
        }
        const code = option.data("code");

        getAllDistrictByProvinceCode(code);
    });

    $("#district").on("change", function () {
        const value = this.value;
        if (!value || !value.trim()) {
            return;
        }
        const option = $("#districtList").find(`option[value="${value}"]`);
        if (!option) {
            return;
        }
        const code = option.data("code");

        getAllWardByDistrictCode(code);
    });

    if (document.querySelector("#dob")) {
        const dobDialog = new mdDateTimePicker.default({
            type: "date",
        });

        dobDialog.trigger = document.querySelector("#dob");

        document.querySelector("#dob").addEventListener("onOk", function () {
            // Detail format option here: https://momentjs.com/docs/#/displaying/format/
            this.value = dobDialog.time.format("DD/MM/YYYY");
            this.focus();

            // Hide backdrop
            $(".custom-modal-backdrop").removeClass("show");
        });

        document.querySelector("#dob").addEventListener("onCancel", function () {
            // Detail format option here: https://momentjs.com/docs/#/displaying/format/
            // Hide backdrop
            $(".custom-modal-backdrop").removeClass("show");
        });

        $("#dob").on("click", function () {
            toggleDatepickerDialog(dobDialog);
        });
    }
});

function closeProfileModal() {
    $("#profileModalDialog").addClass("animate__slideOutLeft");
    $(".custom-modal-backdrop").removeClass("show");

    setTimeout(() => {
        $("#profileModal").removeClass("show");
        $("#profileModalDialog").removeClass("animate__slideOutLeft");
    }, 500);
}

function toggleDatepickerDialog(dialog) {
    dialog.toggle();
    // Show backdrop
    $(".custom-modal-backdrop").addClass("show");
}

function activeProfileBar() {
    const activeHref = location.pathname + location.hash;

    const navItems = document.querySelectorAll(".profile-bar-item");
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

function fetchAllProvince() {
    $.getJSON("https://provinces.open-api.vn/api/?depth=1", function (data) {
        const provinceList = data;
        insertOptionsToTarget($("#provinceList"), provinceList);
    }).fail(function (error) {
        console.log(error);
        $("#provinceList").html("<option disabled value='Empty'>");
    });
}

function insertOptionsToTarget(target, data) {
    target.empty();
    const options = data.map((d) => {
        return `<option value="${d.name}" data-code="${d.code}">`;
    });

    target.html(options);
}

function getAllDistrictByProvinceCode(code) {
    $.getJSON(`https://provinces.open-api.vn/api/p/${code}?depth=2`, function (res) {
        const districts = res.districts;
        insertOptionsToTarget($("#districtList"), districts);
    }).fail(function (error) {
        console.log(error);
        $("#provinceList").html("<option disabled value='Empty'>");
    });
}

function getAllWardByDistrictCode(code) {
    $.getJSON(`https://provinces.open-api.vn/api/d/${code}?depth=2`, function (res) {
        const wards = res.wards;
        insertOptionsToTarget($("#wardList"), wards);
    }).fail(function (error) {
        console.log(error);
        $("#provinceList").html("<option disabled value='Empty'>");
    });
}
