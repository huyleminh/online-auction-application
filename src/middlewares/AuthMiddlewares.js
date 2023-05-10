export default class AuthMiddlewares {
    static authorizeUser(req, res, next) {
        const { user } = req;
        if (!user) {
            req.session.returnUrl = req.originalUrl;
            return res.redirect("/login"); // Forbidden
        }

        next();
    }

    static authorizeAdmin(req, res, next) {
        const { user } = req;
        if (!user) {
            req.session.returnUrl = req.originalUrl;
            return res.redirect("/login");
        }

        const { role } = user;
        if (role === undefined || role === null || typeof role !== "number" || role === 0) {
            return res.redirect("/403");
        }

        next();
    }

    static setReturnURL(req, res, next) {
        // if (req.session.returnUrl) {
        //     return next();
        // }

        // const { referer } = req.headers;

        // if (!referer || referer.match(/(forget-pwd)|(signup)|(login)/g)) {
        //     req.session.returnUrl = "/";
        // } else {
        //     req.session.returnUrl = referer;
        // }
        next();
    }
}
