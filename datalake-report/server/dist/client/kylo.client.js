"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../Logger");
const Config_1 = require("../Config");
const Helper = require("../Helper");
const requestPromise = require("request-promise");
class KyloClient {
    constructor() {
        this.authorization = 'Basic ' + Helper.btoa(`${Config_1.Config.ADMIN_USER.USERNAME1}:${Config_1.Config.ADMIN_USER.PASSWORD}`);
    }
    getHiveTablesBySchema(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.Loggers.consoleLog.error(`getFeedCategoryByName( name: ${name} )`);
                const params = {
                    uri: `${Config_1.Config.REST_END_POINT.BASE_PATH}${Config_1.Config.REST_END_POINT.HIVE_SCHEMA_END_POINT}${name}/tables`,
                    headers: {
                        'Authorization': this.authorization
                    },
                    json: true
                };
                Logger_1.Loggers.consoleLog.error(`getFeedCategoryByName( params:${JSON.stringify(params, null, "\t")} name: ${name} )`);
                const response = yield requestPromise(params);
                if (!!response) {
                    return response;
                }
                Logger_1.Loggers.consoleLog.warn(`getFeedCategoryByName Failes( response: ${JSON.stringify(response, null, "\t")} name:${name} )`);
                return null;
            }
            catch (error) {
                Logger_1.Loggers.consoleLog.error(`getFeedCategoryByName Fault( error: ${error}, name: ${name} )`);
                throw error;
            }
        });
    }
}
exports.KyloClient = KyloClient;
