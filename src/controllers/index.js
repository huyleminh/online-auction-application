import HomeController from "./home/HomeController.js";
import AuthController from "./auth/AuthController.js";

const AppControllers = [new HomeController(), new AuthController()];

export default AppControllers;
