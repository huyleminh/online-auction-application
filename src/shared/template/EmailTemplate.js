import { APP_CONFIG } from "../../config/index.js";

export default class EmailTemplate {
    static OTPTemplate(otpcode) {
        return this.generateTemplate(`
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
        `);
    }

    static OTPForgotPasswordTemplate(otpcode) {
        return this.generateTemplate(`
            <br />
            <p style="margin: 0; font-size: 16px">
                You have just requested reset password permission, this is your confirmation OTP at <b>H2A Bid</b>
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
        `);
    }

    static upgradeSellerOk() {
        return this.generateTemplate(`
            <p style="font-size: 16px">
                <b>H2A Bid</b> administrators have
                <b style="color: green">confirmed</b> your upgrade to be a seller request.
            </p>

            <p style="font-size: 16px; color: red">
                You will be downgraded to bidder again after <b>7 days</b>
            </p>
        `);
    }

    static upgradeSellerDeny() {
        return this.generateTemplate(`
            <p st<p style="font-size: 16px">
                <b>H2A Bid</b> administrators have
                <b style="color: red">denied</b> your upgrade to be a seller request.
            </p>

            <p style="font-size: 16px; color: red">
                You can request again via our application.
            </p>
        `);
    }

    static downgradeSeller() {
        return this.generateTemplate(`
            <p style="font-size: 16px">
                <b>H2A Bid</b> administrators have
                <b style="color: red">recalled</b> your seller access.
            </p>

            <p style="font-size: 16px;">
                You can request to be a seller again via our application.
            </p>
        `);
    }

    static bidResultSeller(productName, price) {
        return this.generateTemplate(`
            <p style="font-size: 16px">
                Your product - ${productName} has been bought with ${price} VND
            </p>
            <p style="font-size: 16px">
                You can view at ${APP_CONFIG.appUrl}/seller/products/results
            </p>
        `);
    }

    static biddingResultBidder(productName, price) {
        return this.generateTemplate(`
            <p style="font-size: 16px">
                You have won ${productName} with ${price} VND
            </p>
            <p style="font-size: 16px">
                You can view detail and rate the owner of this product at ${APP_CONFIG.appUrl}/bidder/won
            </p>
        `);
    }

    static biddingPriceWarningBidder() {
        return this.generateTemplate(`
            <p style="font-size: 16px">
                Your max tolerable price has been surpassed
            </p>
            <p style="font-size: 16px">
                You can view at ${APP_CONFIG.appUrl}/bidder/bidding
            </p>
        `);
    }

    static noResultSeller(productName) {
        return this.generateTemplate(`
            <p style="font-size: 16px">
                Time for your ${productName} has been expired and there is no bidder won this one
            </p>
            <p style="font-size: 16px">
                You can view at ${APP_CONFIG.appUrl}/seller/products/results
            </p>
        `);
    }

    static productHasBeenDeletedByAdmin(productName, emailAdmin) {
        return this.generateTemplate(`
        <p style="font-size: 16px">
            Your product <b>${productName}</b> has been deleted by the administrator.
        </p>
        <p style="font-size: 16px">
            For more detail, please email to <b>${emailAdmin}</b>.
        </p>
        `);
    }

    static generateTemplate(content) {
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
                        <p style="font-size: 16px"><b>Hello ,</b></p>
                        ${content}
                        <div style="border-top: 1px solid #dcdbdb"></div>
                        <p style="font-size: 16px">Best regards,</p>
                        <p style="margin: 0; font-size: 16px"><span class="il">H2A</span> Bid</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    static banBidder(productName) {
        return this.generateTemplate(`
            <p style="font-size: 16px">
                You have been banned from bidding for ${productName}
            </p>

            <p style="font-size: 16px; color: red">
                You will have never bid for ${productName}. You can visit ${APP_CONFIG.appUrl}/bidder/bidding.
            </p>
        `);
    }

    static hidPriceSuccessBidder(productName, price) {
        return this.generateTemplate(`
            <p style="font-size: 16px; color: green">
                You have been hit with <b>${price} VND</b> for ${productName}
            </p>
            <p style="font-size: 16px;">
                You can visit ${APP_CONFIG.appUrl}/bidder/bidding to view you bidding product list.
            </p>
            <p style="font-size: 16px;">
                We send this email to confirm that you have done this action.
            </p>
        `);
    }

    static resetPasswordUser(password) {
        return this.generateTemplate(`
            <p style="font-size: 16px">
                <b>H2A Bid</b> administrators have
                <b style="color: green">reset</b> your password.
            </p>

            <p style="font-size: 16px;">
                This is your new password
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
                    ${password}
                </div>
                <div style="color: red; font-weight: bolder; margin-top: 10px">
                    <i>* You must change your password as soon as login to our system.</i>
                </div>
            </div>
        `);
    }

    static cancelAuctionResultBidder(productName) {
        return this.generateTemplate(`
            <p style="font-size: 16px;">
                Your bid result on <b>${productName}</b> has been cancel by the seller
            </p>
        `);
    }
}
