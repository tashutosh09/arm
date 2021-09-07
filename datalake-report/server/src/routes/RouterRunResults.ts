import { HiveQueries } from './../HiveQueries';
import { Constants } from './../Constants';
import { Loggers } from './../Logger';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';

import { Router, Request, Response, NextFunction } from 'express';
import * as requestPromise from 'request-promise';
import * as request from 'request';

import { DbQueries } from '../database/DbQueries';
import { Config } from '../Config';
import Database from '../database/Database';

import * as fse from 'fs-extra';

import { getRunResultFilePath, decrypt, getUserName } from '../Helper';

import * as jsonToCsv from 'json-to-csv-stream';
import * as jwt from 'jsonwebtoken';
import { toFormatedDateTime } from '../common_code/CommonHelper';

import * as  zlib from 'zlib';

export class RouterRunResults {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        //this.router.post('/get', this.get);
        this.router.get('/get', this.get)
    }
    public get(req: Request, res: Response, next: NextFunction) {
        console.log (">>>>"+ req.query.RuleRunID); 
       // console.log("Hive Query"+`${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.SELECT_QUERY_END_POINT}?query=${hiveQuery}`);
        console.log("Hive Query"+`${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.SELECT_QUERY_END_POINT}`);
        
        if (req.query.RuleRunID) {
            const ruleRunID = req.query.RuleRunID;

            //Loggers.downloadQueryServiceResultLog.info(`Download result Requested RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);
            
            let isExistingFile = false;
            if (fse.existsSync(getRunResultFilePath(ruleRunID))) {
                const stats = fse.statSync(getRunResultFilePath(ruleRunID))
                isExistingFile = stats.size > 0;
            }

            console.log("===55 Line getRunResultFilePath");

            if (!isExistingFile) {
            
                // Get Run Rule history details
                Database.query(DbQueries.getRunRuleHistoryDetailsForResults(ruleRunID)).then((runRuleHistoryDetails) => {

                    if (runRuleHistoryDetails && runRuleHistoryDetails.length > 0) {

                        Database.query(DbQueries.getQueryResultColumns(runRuleHistoryDetails[0].QueryID)).then((queryRuleCols) => {

                            if (queryRuleCols && queryRuleCols.length > 0) {
                                let params = JSON.parse(runRuleHistoryDetails[0].RuleParam);
                                let hiveQuery = HiveQueries.getRuleRunResults(queryRuleCols[0].ResultColumns,
                                    params['config.auditruledb.name'],
                                    runRuleHistoryDetails[0].TargetTableName,
                                    params['param.source.dbname'],
                                    toFormatedDateTime(runRuleHistoryDetails[0].RuleRunStartTime))

                                    console.log("Hive Query"+`${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.SELECT_QUERY_END_POINT}?query=${hiveQuery}`);

                                Loggers.serviceGtddlLog.info(`Get run results QUERY[${hiveQuery}]`);
                                console.log("===3256265526356Line getRunResultFilePath");
                               // return;
                                let rs = request
                                    .get({
                                        method: 'GET',
                                        uri: `${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.SELECT_QUERY_END_POINT}?query=${hiveQuery}`,
                                        headers: {
                                            'Authorization': Config.REST_END_POINT.AUTH1
                                        }
                                    })
                                    .on('response', () => {
                                        Loggers.serviceGtddlLog.info(`Get run results Success QUERY[${hiveQuery}]`);
                                        //Loggers.downloadQueryServiceResultLog.info(`Download result Started RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);

                                        res.writeHead(200, { 'Content-Encoding': 'gzip' });

                                        const gzip = zlib.createGzip();

                                        let processedStream = rs
                                            .pipe(jsonToCsv({
                                                path: ['rows', true],
                                                csv: {
                                                    separator: '\t'
                                                }
                                            }));
                                        processedStream.pipe(fse.createWriteStream(getRunResultFilePath(ruleRunID)));
                                        processedStream.pipe(gzip).pipe(res);

                                    })
                                    .on('end', function () {
                                        //Loggers.downloadQueryServiceResultLog.info(`Download result Completed RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);
                                    })
                                    .on('error', function (err) {
                                        //Loggers.downloadQueryServiceResultLog.error(`Download result Failed ERROR[${err}] RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);
                                        Loggers.serviceGtddlLog.info(`Get run results Failed ERROR[${err}] QUERY[${hiveQuery}]`);
                                        return next({ status: 500, reason: err });
                                    });
                                
                            } else {
                                Loggers.dbRuleMetadataLog.error(`QueryID[${runRuleHistoryDetails[0].QueryID}] Not found`);
                                //Loggers.downloadQueryServiceResultLog.error(`Download result QueryID not found RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);

                                return next({ status: 500, reason: "No details found for given RunRuleID" });
                            }
                        });
                        
                    } else {
                        Loggers.dbRuleMetadataLog.error(`RuleRunID[${ruleRunID}] Not found`);
                        //Loggers.downloadQueryServiceResultLog.error(`Download result RunRuleID not found RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);

                        return next({ status: 500, reason: "No details found for given RunRuleID" });
                    }

                }, (error) => {
                    return next({ status: 500, reason: error });
                });
            
            } else {
                res.writeHead(200, { 'Content-Encoding': 'gzip' });

                const gzip = zlib.createGzip();

                console.log("===136 Line getRunResultFilePath");

                const filePath = getRunResultFilePath(ruleRunID);
                //Loggers.downloadQueryServiceResultLog.info(`Download result Cache Found RuleRunID[${ruleRunID}] USER[${getUserName(req)}] PATH[${filePath}]`);
                const src = fse.createReadStream(filePath);
                src.pipe(gzip).pipe(res);
            }
        } else {
            return next({ status: 400 });
        }

    }
    public getOld(req: Request, res: Response, next: NextFunction) {

        if (req.query.RuleRunID) {
            const ruleRunID = req.query.RuleRunID;

            //Loggers.downloadQueryServiceResultLog.info(`Download result Requested RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);


            let isExistingFile = false;
            if (fse.existsSync(getRunResultFilePath(ruleRunID))) {
                const stats = fse.statSync(getRunResultFilePath(ruleRunID))
                isExistingFile = stats.size > 0;
            }

            console.log("===55 Line getRunResultFilePath");

            if (!isExistingFile) {

                // Get Run Rule history details
                Database.query(DbQueries.getRunRuleHistoryDetailsForResults(ruleRunID)).then((runRuleHistoryDetails) => {

                    if (runRuleHistoryDetails && runRuleHistoryDetails.length > 0) {

                        Database.query(DbQueries.getQueryResultColumns(runRuleHistoryDetails[0].QueryID)).then((queryRuleCols) => {

                            if (queryRuleCols && queryRuleCols.length > 0) {
                                let params = JSON.parse(runRuleHistoryDetails[0].RuleParam);
                                let hiveQuery = HiveQueries.getRuleRunResults(queryRuleCols[0].ResultColumns,
                                    params['config.auditruledb.name'],
                                    runRuleHistoryDetails[0].TargetTableName,
                                    params['param.source.dbname'],
                                    toFormatedDateTime(runRuleHistoryDetails[0].RuleRunStartTime))

                                    console.log("Hive Query"+`${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.SELECT_QUERY_END_POINT}?query=${hiveQuery}`);

                                Loggers.serviceGtddlLog.info(`Get run results QUERY[${hiveQuery}]`);
                                let rs = request
                                    .get({
                                        method: 'GET',
                                        uri: `${Config.REST_END_POINT.BASE_PATH}${Config.REST_END_POINT.SELECT_QUERY_END_POINT}?query=${hiveQuery}`,
                                        headers: {
                                            'Authorization': Config.REST_END_POINT.AUTH1
                                        }
                                    })
                                    .on('response', () => {
                                        Loggers.serviceGtddlLog.info(`Get run results Success QUERY[${hiveQuery}]`);
                                        //Loggers.downloadQueryServiceResultLog.info(`Download result Started RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);

                                        res.writeHead(200, { 'Content-Encoding': 'gzip' });

                                        const gzip = zlib.createGzip();

                                        let processedStream = rs
                                            .pipe(jsonToCsv({
                                                path: ['rows', true],
                                                csv: {
                                                    separator: '\t'
                                                }
                                            }));
                                        processedStream.pipe(fse.createWriteStream(getRunResultFilePath(ruleRunID)));
                                        processedStream.pipe(gzip).pipe(res);

                                    })
                                    .on('end', function () {
                                        //Loggers.downloadQueryServiceResultLog.info(`Download result Completed RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);
                                    })
                                    .on('error', function (err) {
                                        //Loggers.downloadQueryServiceResultLog.error(`Download result Failed ERROR[${err}] RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);
                                        Loggers.serviceGtddlLog.info(`Get run results Failed ERROR[${err}] QUERY[${hiveQuery}]`);
                                        return next({ status: 500, reason: err });
                                    });

                            } else {
                                Loggers.dbRuleMetadataLog.error(`QueryID[${runRuleHistoryDetails[0].QueryID}] Not found`);
                                //Loggers.downloadQueryServiceResultLog.error(`Download result QueryID not found RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);

                                return next({ status: 500, reason: "No details found for given RunRuleID" });
                            }
                        });

                    } else {
                        Loggers.dbRuleMetadataLog.error(`RuleRunID[${ruleRunID}] Not found`);
                        //Loggers.downloadQueryServiceResultLog.error(`Download result RunRuleID not found RuleRunID[${ruleRunID}] USER[${getUserName(req)}]`);

                        return next({ status: 500, reason: "No details found for given RunRuleID" });
                    }

                }, (error) => {
                    return next({ status: 500, reason: error });
                });
            } else {
                res.writeHead(200, { 'Content-Encoding': 'gzip' });

                const gzip = zlib.createGzip();

                console.log("===136 Line getRunResultFilePath");

                const filePath = getRunResultFilePath(ruleRunID);
                //Loggers.downloadQueryServiceResultLog.info(`Download result Cache Found RuleRunID[${ruleRunID}] USER[${getUserName(req)}] PATH[${filePath}]`);
                const src = fse.createReadStream(filePath);
                src.pipe(gzip).pipe(res);
            }
        } else {
            return next({ status: 400 });
        }
    }
}


