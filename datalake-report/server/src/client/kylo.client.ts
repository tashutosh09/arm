import { Loggers } from '../Logger';
import { Config } from '../Config';
import * as Helper from '../Helper';
import * as requestPromise from 'request-promise';

export class KyloClient {

    private authorization: String; 

    constructor() {
        this.authorization = 'Basic ' + Helper.btoa(`${Config.ADMIN_USER.USERNAME1}:${Config.ADMIN_USER.PASSWORD}`);
    }

    public async getHiveTablesBySchema(name: String) {
        try {
            Loggers.consoleLog.error(`getFeedCategoryByName( name: ${name} )`);
            const params = {
                uri: `${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.HIVE_SCHEMA_END_POINT}${name}/tables`,
                headers: {
                    'Authorization': this.authorization
                },
                json: true
            };
            Loggers.consoleLog.error(`getFeedCategoryByName( params:${JSON.stringify(params, null, "\t")} name: ${name} )`);
            const response = await requestPromise(params);
            if(!!response) {
                return response;
            }
            Loggers.consoleLog.warn(`getFeedCategoryByName Failes( response: ${JSON.stringify(response, null, "\t")} name:${name} )`);
            return null;
        } catch(error) {
            Loggers.consoleLog.error(`getFeedCategoryByName Fault( error: ${error}, name: ${name} )`);
            throw error; 
        }
    } 

}
