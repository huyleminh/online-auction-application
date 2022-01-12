$(document).ready(function () {
    if (window.location.pathname === "/signup") {
        fetchAllProvince();
    }

    document.querySelectorAll(".form-outline").forEach((formOutline) => {
        new mdb.Input(formOutline).init();
    });

    $("#username").on("change", function () {
        const username = $("#username").val();
        if (!username || !username.trim()) {
            return;
        }
        if (username.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            $("#usernameText").html("You cannot use an email as username");
            return;
        }
        $.get(`/api/signup/verify/${username}`, function (data) {
            if (data.status === 200) {
                $("#usernameText").html("");
            } else if (data.status === 400) {
                $("#usernameText").html("Username has been chosen");
                return;
            } else if (data.status === 500) {
                alert("Something went wrong");
                return;
            }
        });
    });

    $("#signupForm").on("submit", function (e) {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }

        // Check value off OTP
        const otpValue = $("#otpCode").val();
        if (
            !otpValue ||
            !otpValue.trim() ||
            !otpValue.match(/^[0-9]{6}$/g) ||
            $("#otpCode").prop("disabled")
        ) {
            $("#otpText").html("OTP code is required and must be a 6-digit number");
            return;
        }

        $("#signupForm").off("submit").submit();
    });

    // Get reset password OTP
    $("#getOTPBtn").on("click", function () {
        const email = $("#email").val();
        if (!email) {
            alert("Please input contact email");
            return;
        }
        $("#emailtext").html("Sending OTP...");
        $("#emailtext").removeClass("text-danger");
        $("#emailtext").removeClass("text-success");

        $.post("/api/signup/otp", { email }, function (data) {
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
                $("#emailtext").html("Something went wrong, please get OTP code latter");
                $("#emailtext").addClass("text-danger");
            }
        });
    });

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

        $("#district").val("");
        $("#district").removeClass("active");
        $("#ward").val("");
        $("#ward").removeClass("active");

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

        $("#ward").val("");
        $("#ward").removeClass("active");

        getAllWardByDistrictCode(code);
    });

    // Login
    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        const username = $("#usernameLogin").val();
        if (!username.trim()) {
            $("#usernameLoginText").addClass("text-danger");
            $("#usernameLoginText").html("Tên đăng nhập không được bỏ trống");
            return;
        }

        const password = $("#passwordLogin").val();
        if (!password.trim() || password.length < 6) {
            $("#passwordLoginText").addClass("text-danger");
            $("#passwordLoginText").html("Mật khẩu phải có ít nhất 6 kí tự");
            return;
        }

        $("#loginForm").off("submit").submit();
    });

    // Get reset password OTP
    $("#getOTPBtnFgPwd").on("click", function () {
        const email = $("#emailFgPwd").val();
        if (!email) {
            alert("Please input contact email");
            return;
        }

        $("#emailTextFgPwd").html("Sending OTP...");
        $("#emailTextFgPwd").removeClass("text-danger");
        $("#emailTextFgPwd").removeClass("text-success");

        $.post("/api/forget-pwd/otp", { email }, function (data) {
            if (data.status === 200) {
                $("#otpCode").prop("disabled", false);
                $("#emailTextFgPwd").html(
                    "OTP code has been sent to your email, it will expire soon. Please enter in the input below. If you cannot receive OTP, click GET OTP again"
                );
                $("#emailTextFgPwd").addClass("text-success");
                $("#emailTextFgPwd").removeClass("text-danger");
            } else if (data.status === 400) {
                $("#otpCode").prop("disabled", true);
                $("#emailTextFgPwd").html(data.message);
                $("#emailTextFgPwd").addClass("text-danger");
            } else {
                $("#otpCode").prop("disabled", true);
                $("#emailTextFgPwd").html("Something went wrong, please get OTP code latter");
                $("#emailTextFgPwd").addClass("text-danger");
            }
        });
    });

    // Forgot password form
    $("#fgPwdForm").on("submit", function (e) {
        e.preventDefault();
        if ($("#otpCode").prop("disabled")) {
            return;
        }

        $("#fgPwdForm").off("submit").submit();
    });

    // Reset password form
    $("#resetPwdForm").on("submit", function (e) {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }
        $("#resetPwdForm").off("submit").submit();
    });
});

function validatePassword() {
    const password = $("#password").val();
    const confirm = $("#confirmPassword").val();

    if (!password.trim() || password.length < 6) {
        $("#passwordText").addClass("text-danger");
        return false;
    }
    $("#passwordText").removeClass("text-danger");

    if (!confirm.trim() || password !== confirm) {
        $("#confirmPasswordText").addClass("text-danger");
        return false;
    }
    $("#confirmPasswordText").removeClass("text-danger");
    return true;
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
