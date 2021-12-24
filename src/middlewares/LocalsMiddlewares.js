export default class LocalsMiddlewares {
    // Move user in session.passport to locals
    static exchangeAuthLocalData(req, res, next) {
        const user = req.user;
        if (user) {
            res.locals.localUser = user;
        }
        next();
    }

    static getAll() {
        return [this.exchangeAuthLocalData];
    }
}
