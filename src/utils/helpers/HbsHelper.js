import moment from "moment";
import numeral from "numeral";
import CommonConst from "../../shared/CommonConst.js";

moment.locale("vi");
export default class HbsHelper {
    static isEqual(left, right) {
        return left === right;
    }

    static isNotEqual(left, right) {
        return left !== right;
    }

    static isGreaterThan(left, right) {
        return left > right;
    }

    static isLessThan(left, right) {
        return left < right;
    }

    static formatDate(date) {
        return moment(date).format(CommonConst.MOMENT_BASE_USER_FORMAT);
    }

    static formatMoney(val) {
        return numeral(val).format("0,0");
    }

    static add(left, right) {
        return left + right;
    }

    static calcNo(index, page) {
        return (page - 1) * CommonConst.ITEMS_PER_TABLE_PAGE + index + 1;
    }

    static subtract(left, right) {
        return left - right;
    }

    static and(left, right) {
        return left && right;
    }

    static or(left, right) {
        return left || right;
    }

    static isIn(element, parent) {
        if (parent.findIndex((item) => item.product_id === element) !== -1) {
            return true;
        }
        return false;
    }

    static checkBan(ban, isSold, expiredDate) {
        return ban || isSold || (isSold === 0 && moment(expiredDate).isBefore(moment()));
    }

    static getAll() {
        return {
            isEqual: this.isEqual,
            isNotEqual: this.isNotEqual,
            formatDate: this.formatDate,
            formatMoney: this.formatMoney,
            isGreaterThan: this.isGreaterThan,
            isLessThan: this.isLessThan,
            add: this.add,
            calcNo: this.calcNo,
            subtract: this.subtract,
            and: this.and,
            or: this.or,
            isIn: this.isIn,
            checkBan: this.checkBan,
        };
    }
}
