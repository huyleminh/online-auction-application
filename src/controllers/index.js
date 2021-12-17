import AuthController from "./auth/AuthController.js";
import HomeController from "./home/HomeController.js";
import ProductController from "./products/ProductController.js";

const AppControllers = [new HomeController(), new AuthController(), new ProductController()];

export default AppControllers;
