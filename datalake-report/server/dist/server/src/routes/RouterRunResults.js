"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HiveQueries_1 = require("./../HiveQueries");
const Logger_1 = require("./../Logger");
require("rxjs/add/observable/of");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/do");
const express_1 = require("express");
const request = require("request");
const DbQueries_1 = require("../database/DbQueries");
const Config_1 = require("../Config");
const Database_1 = require("../database/Database");
const fse = require("fs-extra");
const Helper_1 = require("../Helper");
const jsonToCsv = require("json-to-csv-stream");
const CommonHelper_1 = require("../common_code/CommonHelper");
const zlib = require("zlib");
class RouterRunResults {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        //this.router.post('/get', this.get);
        this.router.get('/get', this.get);
    }
    get(req, res, next) {
        if (req.query.RuleRunID) {
            const ruleRunID = req.query.RuleRunID;
            Logger_1.Loggers.downloadQueryServiceResultLog.info(`Download result Requested RuleRunID[${ruleRunID}] USER[${Helper_1.getUserName(req)}]`);
            let isExistingFile = false;
            if (fse.existsSync(Helper_1.getRunResultFilePath(ruleRunID))) {
                const stats = fse.statSync(Helper_1.getRunResultFilePath(ruleRunID));
                isExistingFile = stats.size > 0;
            }
            if (!isExistingFile) {
                // Get Run Rule history details
                Database_1.default.query(DbQueries_1.DbQueries.getRunRuleHistoryDetailsForResults(ruleRunID)).then((runRuleHistoryDetails) => {
                    if (runRuleHistoryDetails && runRuleHistoryDetails.length > 0) {
                        Database_1.default.query(DbQueries_1.DbQueries.getQueryResultColumns(runRuleHistoryDetails[0].QueryID)).then((queryRuleCols) => {
                            if (queryRuleCols && queryRuleCols.length > 0) {
                                let params = JSON.parse(runRuleHistoryDetails[0].RuleParam);
                                let hiveQuery = HiveQueries_1.HiveQueries.getRuleRunResults(queryRuleCols[0].ResultColumns, params['config.auditruledb.name'], runRuleHistoryDetails[0].TargetTableName, params['param.source.dbname'], CommonHelper_1.toFormatedDateTime(runRuleHistoryDetails[0].RuleRunStartTime));
                                Logger_1.Loggers.serviceGtddlLog.info(`Get run results QUERY[${hiveQuery}]`);
                                let rs = request
                                    .get({
                                    method: 'GET',
                                    uri: `${Config_1.Config.REST_END_POINT.BASE_PATH}${Config_1.Config.REST_END_POINT.SELECT_QUERY_END_POINT}?query=${hiveQuery}`,
                                    headers: {
                                        'Authorization': Config_1.Config.REST_END_POINT.AUTH1
                                    }
                                })
                                    .on('response', () => {
                                    Logger_1.Loggers.serviceGtddlLog.info(`Get run results Success QUERY[${hiveQuery}]`);
                                    Logger_1.Loggers.downloadQueryServiceResultLog.info(`Download result Started RuleRunID[${ruleRunID}] USER[${Helper_1.getUserName(req)}]`);
                                    res.writeHead(200, { 'Content-Encoding': 'gzip' });
                                    const gzip = zlib.createGzip();
                                    let processedStream = rs
                                        .pipe(jsonToCsv({
                                        path: ['rows', true],
                                        csv: {
                                            separator: '\t'
                                        }
                                    }));
                                    processedStream.pipe(fse.createWriteStream(Helper_1.getRunResultFilePath(ruleRunID)));
                                    processedStream.pipe(gzip).pipe(res);
                                })
                                    .on('end', function () {
                                    Logger_1.Loggers.downloadQueryServiceResultLog.info(`Download result Completed RuleRunID[${ruleRunID}] USER[${Helper_1.getUserName(req)}]`);
                                })
                                    .on('error', function (err) {
                                    Logger_1.Loggers.downloadQueryServiceResultLog.error(`Download result Failed ERROR[${err}] RuleRunID[${ruleRunID}] USER[${Helper_1.getUserName(req)}]`);
                                    Logger_1.Loggers.serviceGtddlLog.info(`Get run results Failed ERROR[${err}] QUERY[${hiveQuery}]`);
                                    return next({ status: 500, reason: err });
                                });
                            }
                            else {
                                Logger_1.Loggers.dbRuleMetadataLog.error(`QueryID[${runRuleHistoryDetails[0].QueryID}] Not found`);
                                Logger_1.Loggers.downloadQueryServiceResultLog.error(`Download result QueryID not found RuleRunID[${ruleRunID}] USER[${Helper_1.getUserName(req)}]`);
                                return next({ status: 500, reason: "No details found for given RunRuleID" });
                            }
                        });
                    }
                    else {
                        Logger_1.Loggers.dbRuleMetadataLog.error(`RuleRunID[${ruleRunID}] Not found`);
                        Logger_1.Loggers.downloadQueryServiceResultLog.error(`Download result RunRuleID not found RuleRunID[${ruleRunID}] USER[${Helper_1.getUserName(req)}]`);
                        return next({ status: 500, reason: "No details found for given RunRuleID" });
                    }
                }, (error) => {
                    return next({ status: 500, reason: error });
                });
            }
            else {
                res.writeHead(200, { 'Content-Encoding': 'gzip' });
                const gzip = zlib.createGzip();
                const filePath = Helper_1.getRunResultFilePath(ruleRunID);
                Logger_1.Loggers.downloadQueryServiceResultLog.info(`Download result Cache Found RuleRunID[${ruleRunID}] USER[${Helper_1.getUserName(req)}] PATH[${filePath}]`);
                const src = fse.createReadStream(filePath);
                src.pipe(gzip).pipe(res);
            }
        }
        else {
            return next({ status: 400 });
        }
    }
}
exports.RouterRunResults = RouterRunResults;
