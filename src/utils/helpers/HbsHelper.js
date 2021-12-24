export default class HbsHelper {
    static isEqual(left, right) {
        return left === right;
    }

    static getAll() {
        return {
            isEqual: this.isEqual,
        };
    }
}
