import AuthController from "./auth/AuthController.js";
import HomeController from "./home/HomeController.js";
import ProductController from "./products/ProductController.js";
import BidderController from "./user/BidderController.js";
import SellerController from "./user/SellerController.js";
import UserController from "./user/UserController.js";

const AppControllers = [
    new HomeController(),
    new AuthController(),
    new ProductController(),
    new UserController(),
    new BidderController(),
    new SellerController(),
];

export default AppControllers;
