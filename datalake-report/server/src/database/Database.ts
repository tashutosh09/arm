import { Loggers } from './../Logger';
import { DbQueries } from './DbQueries';
import { Config } from './../Config';
import * as mysql from 'mysql';

export class Database {
    config = {
        connectionLimit: Config.DATABASE.CONNECTION_LIMIT,
        host: Config.DATABASE.HOST,
        port: Config.DATABASE.PORT,
        user: Config.DATABASE.USER,
        password: Config.DATABASE.PASSWORD,
        database: Config.DATABASE.DATABASE,
        debug: Config.DATABASE.DEBUG,
        multipleStatements: Config.DATABASE.ALLOW_MULTIPLE_STATEMENTS

    };
    pool = mysql.createPool(this.config);

    public query(query: string): Promise<any> {

        Loggers.dbRuleMetadataLog.info(query);

        return new Promise<any>((resolve, reject) => {

            this.pool.getConnection(function (err, connection) {
                if (err) {
                    Loggers.dbRuleMetadataLog.error(err.toString());
                    reject(err);
                } else {
                    connection.query(query, (err, result) => {
                        connection.release();
                        if (err) {
                            Loggers.dbRuleMetadataLog.error(err.toString());
                            reject(err);
                        }
                        resolve(result);
                    });

                    connection.on('error', function (err) {
                        Loggers.dbRuleMetadataLog.error(err.toString());
                        reject(err);
                    });
                }
            });
        });
    }
}

const database = new Database();
export default database; 
