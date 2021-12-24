import bcrypt from "bcrypt";

export default class PasswordHelper {
    static generateHashPassword(value) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        return hash;
    }

    static verifyHash(value, hash) {
        const isHashValid = bcrypt.compareSync(value, hash);
        return isHashValid;
    }
}
