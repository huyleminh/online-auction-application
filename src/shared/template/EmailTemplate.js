export default class EmailTemplate {
    static OTPTemplate(otpcode) {
        return `
        <div style="background-color: #f8f8f8; font-family: sans-serif; padding: 15px">
            <div style="max-width: 1000px; margin: auto">
                <div
                    style="
                        background-color: #fff;
                        padding: 10px 30px;
                        color: #fff;
                        display: flex;
                        border-bottom: 1px solid #d4d4d4;
                    "
                >
                    <div style="width: 70px; display: inline-block">
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/the-coffee-shop-gc.appspot.com/o/logo_auction_lite.png?alt=media&token=49ddb9bb-9d1c-4c8d-a2df-e9d4ce878456"
                            style="height: 45px; object-fit: contain"
                            class="CToWUd"
                        />
                    </div>
                </div>
                <div
                    style="
                        background-color: #fff;
                        padding: 5px 20px;
                        color: #000;
                        border-radius: 0px 0px 2px 2px;
                    "
                >
                    <div style="padding: 35px 15px">
                        <p style="margin: 0; font-size: 16px"><b>Hello ,</b></p>
                        <br />
                        <p style="margin: 0; font-size: 16px">
                            You have just received a confirmation OTP at <b>H2A Bid</b>
                        </p>
                        <div style="padding: 40px; margin: auto; text-align: center">
                            <div
                                style="
                                    width: fit-content;
                                    border: 1px solid #6963ff;
                                    color: #6963ff;
                                    font-weight: bold;
                                    text-align: center;
                                    padding: 10px 15px;
                                    border-radius: 3px;
                                    margin: auto;
                                    font-size: large;
                                "
                            >
                                ${otpcode}
                            </div>
                            <div style="color: red; font-weight: bolder; margin-top: 10px">
                                <i>* Your OTP code will expire in 5 minutes.</i>
                            </div>
                        </div>
                        <div style="border-top: 1px solid #dcdbdb"></div>
                        <br />
                        <p style="margin: 0; font-size: 16px">
                            If you do not fulfill this request, please ignore it.
                        </p>
                        <br />
                        <p style="margin: 0; font-size: 16px">Best regards,</p>
                        <p style="margin: 0; font-size: 16px"><span class="il">H2A</span> Bid</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
