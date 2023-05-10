import knex from "knex";
import { APP_CONFIG } from "../config/index.js";

export const KnexConnectionInfo = {
    host: APP_CONFIG.database.host,
    port: APP_CONFIG.database.port,
    user: APP_CONFIG.database.username,
    password: APP_CONFIG.database.password,
    database: APP_CONFIG.database.name,
};

const KnexConnection = knex({
    client: "mysql2",
    connection: KnexConnectionInfo,
    pool: { min: 0, max: 10 },
});

export default KnexConnection;
