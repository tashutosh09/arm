"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./../Logger");
const Config_1 = require("./../Config");
const mysql = require("mysql");
class Database {
    constructor() {
        this.config = {
            connectionLimit: Config_1.Config.DATABASE.CONNECTION_LIMIT,
            host: Config_1.Config.DATABASE.HOST,
            port: Config_1.Config.DATABASE.PORT,
            user: Config_1.Config.DATABASE.USER,
            password: Config_1.Config.DATABASE.PASSWORD,
            database: Config_1.Config.DATABASE.DATABASE,
            debug: Config_1.Config.DATABASE.DEBUG,
            multipleStatements: Config_1.Config.DATABASE.ALLOW_MULTIPLE_STATEMENTS
        };
        this.pool = mysql.createPool(this.config);
    }
    query(query) {
        Logger_1.Loggers.dbRuleMetadataLog.info(query);
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    Logger_1.Loggers.dbRuleMetadataLog.error(err.toString());
                    reject(err);
                }
                else {
                    connection.query(query, (err, result) => {
                        connection.release();
                        if (err) {
                            Logger_1.Loggers.dbRuleMetadataLog.error(err.toString());
                            reject(err);
                        }
                        resolve(result);
                    });
                    connection.on('error', function (err) {
                        Logger_1.Loggers.dbRuleMetadataLog.error(err.toString());
                        reject(err);
                    });
                }
            });
        });
    }
}
exports.Database = Database;
const database = new Database();
exports.default = database;
