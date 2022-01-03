import moment from "moment";

moment.locale("vi")
export default class HbsHelper {
    static isEqual(left, right) {
        return left === right;
    }

    static isNotEqual(left, right) {
        return left !== right;
    }

    static formatDate(date) {
        return moment(date).format("DD/MM/YYYY HH:mm:ss");
    }

    static getAll() {
        return {
            isEqual: this.isEqual,
            isNotEqual: this.isNotEqual,
            formatDate: this.formatDate,
        };
    }
}
