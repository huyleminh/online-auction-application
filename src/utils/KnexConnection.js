import knex from "knex";
import AppConstant from "../shared/AppConstant.js";

export const KnexConnectionInfo = {
    host: AppConstant.DB_HOST,
    port: 3306,
    user: AppConstant.DB_USER_NAME,
    password: AppConstant.DB_PASSWORD,
    database: AppConstant.DB_SCHEMA,
};

const KnexConnection = knex({
    client: "mysql2",
    connection: KnexConnectionInfo,
    pool: { min: 0, max: 10 },
});

export default KnexConnection;
