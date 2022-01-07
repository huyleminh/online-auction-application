import moment from "moment";

export default class CommomUtils {
    static sortProductUtil(productList, sortType) {
        const sorted = productList.sort((left, right) => {
            switch (sortType) {
                case "price_asc":
                    return left.current_price - right.current_price;
                case "price_desc":
                    return right.current_price - left.current_price;
                case "time_asc":
                    return moment(left.expired_date).diff(moment(right.expired_date));
                case "time_asc":
                    return moment(right.expired_date).diff(moment(left.expired_date));
                default:
                    return left.current_price - right.current_price;
            }
        });

        return sorted;
    }
}
