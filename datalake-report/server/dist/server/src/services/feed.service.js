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
const kylo_client_1 = require("../client/kylo.client");
const Logger_1 = require("../Logger");
class FeedService {
    constructor() {
        this.kyloClient = new kylo_client_1.KyloClient();
    }
    getFeedsByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.Loggers.consoleLog.info(`getFeedsByName( name: ${name} )`);
                const tables = yield this.kyloClient.getHiveTablesBySchema(name);
                if (!!tables) {
                    const feeds = this.filterTables(tables);
                    Logger_1.Loggers.consoleLog.debug(`getTablesByName Success( feeds: ${JSON.stringify(feeds, null, "\t")}, name: ${name} )`);
                    return feeds;
                }
                Logger_1.Loggers.consoleLog.warn(`getFeedsByName not found with name: ${name}`);
                return null;
            }
            catch (error) {
                Logger_1.Loggers.consoleLog.error(`getFeedsByName Fault( error:${error}, name: ${name} )`);
                throw error;
            }
        });
    }
    filterTables(tables) {
        return tables.filter((table) => {
            const name = table.split(".")[1];
            return !name.endsWith("_valid") && !name.endsWith("_feed")
                && !name.endsWith("_profile") && !name.endsWith("_invalid");
        }).map((table) => table.split(".")[1]);
    }
}
exports.FeedService = FeedService;
