$(document).ready(function () {
    fetchAllProvince();

    document.querySelectorAll(".form-outline").forEach((formOutline) => {
        new mdb.Input(formOutline).init();
    });

    $("#username").on("change", function () {
        $.get(`/api/signup/verify/${$("#username").val()}`, function (data) {
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

        // Validate username
        // $.get(`/api/signup/verify/${$("#username").val()}`, function (data) {
        //     if (data.status === 200) {
        //         $("#usernameText").html("");

        //         const passwordValidationStatus = validatePassword();
        //         if (!passwordValidationStatus) {
        //             alert("Password is not valid");
        //             return;
        //         }

        //         const email = $("#email").val();
        //         if (!email) {
        //             alert("Please input contact email");
        //             return;
        //         }

        //         // Verify username
        //         $("#signupForm").off("submit").submit();
        //     } else if (data.status === 400) {
        //         $("#usernameText").html("Username has been chosen");
        //         return;
        //     } else if (data.status === 500) {
        //         alert("Something went wrong");
        //         return;
        //     }
        // });

        const passwordValidationStatus = validatePassword();
        if (!passwordValidationStatus) {
            alert("Password is not valid");
            return;
        }

        const email = $("#email").val();
        if (!email) {
            alert("Please input contact email");
            return;
        }

        // Verify username
        $("#signupForm").off("submit").submit();
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
        $.post("/api/signup/otp", { email }, function (data) {
            if (data.status === 200) {
                $("#otpCode").prop("disabled", false);
                $("#emailtext").html(
                    "OTP code has been sent to your email, it will expire soon. Please enter in the input below. If you cannot receive OTP, click GET OTP again"
                );
                $("#emailtext").addClass("text-success");
                $("#emailtext").removeClass("text-danger");
            } else if (data.status === 400) {
                $("#emailtext").html(data.message);
                $("#emailtext").addClass("text-danger");
            } else {
                console.log(data);
                $("#emailtext").html("Something went wrong, please get OTP code latter");
                $("#emailtext").addClass("text-danger");
            }
        });
    });

    $("#province").on("change", function () {
        const value = this.value;
        const option = $("#provinceList").find(`option[value="${value}"]`);
        if (!option) {
            return;
        }
        const code = option.data("code");

        getAllDistrictByProvinceCode(code);
    });

    $("#district").on("change", function () {
        const value = this.value;
        const option = $("#districtList").find(`option[value="${value}"]`);
        if (!option) {
            return;
        }
        const code = option.data("code");

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
});

function validatePassword() {
    const password = $("#password").val();
    const confirm = $("#confirmPassword").val();

    if (!password.trim() || !confirm.trim()) {
        return false;
    }

    if (password.length < 6) {
        return false;
    }

    if (password !== confirm) {
        return false;
    }

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
