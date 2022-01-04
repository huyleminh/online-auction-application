import moment from "moment";
import CommonConst from "../../shared/CommonConst.js";

moment.locale("vi");
export default class HbsHelper {
    static isEqual(left, right) {
        return left === right;
    }

    static isNotEqual(left, right) {
        return left !== right;
    }

    static formatDate(date) {
        return moment(date).format(CommonConst.MOMENT_BASE_USER_FORMAT);
    }

    static getAll() {
        return {
            isEqual: this.isEqual,
            isNotEqual: this.isNotEqual,
            formatDate: this.formatDate,
        };
    }
}
