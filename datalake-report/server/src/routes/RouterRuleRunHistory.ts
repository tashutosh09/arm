import  { Loggers } from '../Logger';
import { Constants } from './../Constants';
import { Router, Request, Response, NextFunction } from 'express';
import { Config } from '../Config';
import * as jwt from 'jsonwebtoken';
import * as Helper from '../Helper';
import Database from '../database/Database';
import { DbQueries } from '../database/DbQueries';
import * as uuidv1 from 'uuid/v1';

export class RouterRuleRunHistory {
    public router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/:action', this.handle);
    }

    public handle(req: Request, res: Response, next: NextFunction) {
        if (req.params && req.params.action) {

            switch (req.params.action) {
                case 'count': {
                    if (req.body) {
                        let conditions = [];
                        if (req.body.RuleID) {
                            conditions.push(`${Constants.TABLES.RULE.key}='${req.body.RuleID}'`);
                        }
                        if (req.body.QueryID) {
                            conditions.push(`${Constants.TABLES.RULE_QUERY.key}='${req.body.QueryID}'`);
                        }

                        if (conditions.length > 0) {
                            Database.query(DbQueries.getRunRuleHistoryCount(conditions)).then((result) => {
                                res.send({
                                    status: true,
                                    results: result
                                });
                            }, (error) => {
                                return next({ status: 500, reason: error });
                            });
                            return;
                        }
                    }
                }
                    break;

                case 'get':
                    if (req.body) {
                        // chinmay Start 
                        
                        /*Loggers.serviceGtddlLog.info(`line case get for view history get entered ${req.headers['x-access-token']}`);                        
                        let decoded = jwt.verify(req.headers['x-access-token'], Config.SECRET.jwt_key);
                        let token = Helper.decrypt(decoded['data']);
                        Loggers.serviceGtddlLog.info(`line case get for view history token ${token}`);
                        let username2 = "";
                        let real_loginauth = Buffer.from(token, 'base64').toString('ascii'); 
                        let splitted = real_loginauth.split(":",2); 
                        username2 =splitted[0];*/
                        
                        //Chinmay End
                        //let username2 = 'qatest_user';

                        let username2 = req.body.UserName;
                        Loggers.serviceGtddlLog.info(`line case get for view history username ${username2}`);
                        let conditions = [];
                        Loggers.serviceGtddlLog.info(`line case get for view history`);
                        if (req.body.RuleID) {
                            conditions.push(`${Constants.TABLES.RULE.key}='${req.body.RuleID}'`);
                        }
                        if (req.body.QueryID) {
                            conditions.push(`${Constants.TABLES.RULE_QUERY.key}='${req.body.QueryID}'`);
                        }
                        if (req.body.RunStatus) {
                            conditions.push(`RunStatus='${req.body.RunStatus}'`);
                        }
                        if (conditions.length > 0) {
                            console.log("req.body.QueryID"+req.body.QueryID);
                            console.log("==="+DbQueries.getRunRuleHistories(conditions, req.body.Limit, req.body.Offset, username2));
                            Database.query(DbQueries.getRunRuleHistories(conditions, req.body.Limit, req.body.Offset, username2)).then((result) => {
                                for (var i = 0; i < result.length; i++) {
                                    //obj = whatever field its currently on (name, email, w/e)
                                    //var param = JSON.parse(result[i].RuleParam);
                                    //var dbname = param['param.source.dbname'];

                                    //Start by Subrata 31-12-2020
                                    Loggers.serviceGtddlLog.info(`line history run [${JSON.parse(result[i].RuleParam)['param.source.dbname']}]`); 

                                    let tRuleID = result[i].RuleID;
                                    let tMessage  = {
                                        LatestRun: {
                                            RuleRunID: result[i].RuleRunID,
                                            BatchID: result[i].BatchID,
                                            RuleID: result[i].RuleID,
                                            QueryID: result[i].QueryID,
                                            RuleExecutedByUser: result[i].RuleExecutedByUser,
                                            RuleQueryFinalString: result[i].RuleQueryFinalString,
                                            TargetTableName: result[i].TargetTableName,
                                            RuleParam: result[i].RuleParam,
                                            RuleRunStartTime: result[i].RuleRunStartTime,
                                            RuleRunEndTime: result[i].RuleRunEndTime,
                                            RunStatus: result[i].RunStatus,
                                            RunLog: result[i].RunLog,
                                            RunResultRowCount: result[i].RunResultRowCount
                                        }
                                    };

                                    console.log(" Inside Router Rule Run History "+"event id "+tRuleID + " event message "+tMessage);
                                    Loggers.serviceGtddlLog.info(" Inside Router Rule Run History "+" event id "+tRuleID+" event message "+JSON.stringify(tMessage));
                                    if(i == 0){
                                        req.app.get('socketio').emit(tRuleID, tMessage);
                                    }
                                    //End by Subrata 31-12-2020
                                }
                                //Loggers.serviceGtddlLog.info(`line history run [${JSON.parse(JSON.stringify(result))[0]['RuleParam']['param.source.dbname']}]`);
                                res.send({
                                    status: true,
                                    results: result
                                });
                            }, (error) => {
                                return next({ status: 500, reason: error });
                            });
                            return;
                        }
                        
                    }
                    break;

                case 'add':
                    //Loggers.serviceGtddlLog.info(`reached add for rulerun history ${JSON.stringify(req.body.rulesToRun)}`);
                    if (req.body && req.body.rulesToRun && req.body.rulesToRun.length > 0) {
                        // chinmay Start 
                        
                        /*let  decoded = jwt.verify(req.headers['x-access-token'], Config.SECRET.jwt_key);
                        let token = Helper.decrypt(decoded['data']);
                        //Loggers.serviceGtddlLog.info(`line case get for view history token ${token}`);
                        let username2 = "";
                        let real_loginauth = Buffer.from(token, 'base64').toString('ascii');
                        let splitted = real_loginauth.split(":",2);
                        username2 = splitted[0];*/
                        
                        //Chinmay End
                        let values = [];
                        let socketEvents = [];
                        //Loggers.serviceGtddlLog.info(`reached add req body check`);
                        for (let item of req.body.rulesToRun) {
                            Loggers.serviceGtddlLog.info(`reached add for rulerun history ${JSON.stringify(item)}`);
                            if (item.RuleRunID
                                && item.QueryID && item.RuleID
                                && item.RuleQueryFinalString
                                && item.RuleParam && item.RuleRunStartTime && item.TargetTableName) {

                                // Generate a unique ID for all the runs triggered in this batch
                                let batchID = uuidv1();

                                // Creating row
                                Loggers.serviceGtddlLog.info(`reached add for rulerun history parameters recieved ${JSON.stringify(item.RuleParam)}`);
                                values.push(`
                                (
                                    '${item.RuleRunID}',
                                    '${batchID}',
                                    '${item.QueryID}',
                                    '${item.RuleID}',
                                    '${item.RuleExecutedByUser}',
                                    "${item.RuleQueryFinalString}",
                                    '${item.TargetTableName}',
                                    '${item.RuleParam}',
                                    '${item.RuleRunStartTime}',
                                    'PENDING',
                                    '', 'null','${JSON.parse(item.RuleParam)['param.source.dbname']}')`);

                                    

                                // Send event to all UI who can listen for events for these rule ID's
                                socketEvents.push({
                                    id: item.RuleID,
                                    message: {
                                        LatestRun: {
                                            RuleRunID: item.RuleRunID,
                                            BatchID: batchID,
                                            RuleID: item.RuleID,
                                            QueryID: item.QueryID,
                                            RuleExecutedByUser: item.RuleExecutedByUser,
                                            RuleQueryFinalString: item.RuleQueryFinalString,
                                            TargetTableName: item.TargetTableName,
                                            RuleParam: item.RuleParam,
                                            RuleRunStartTime: item.RuleRunStartTime,
                                            RuleRunEndTime: null,
                                            RunStatus: 'PENDING',
                                            RunLog: '',
                                            RunResultRowCount: 'null'
                                        }
                                    }
                                });
                            }
                        }

                        if (values && values.length > 0) {
                            //Loggers.serviceGtddlLog.info("Before Execution of insertRunRuleHistory values"+ values);
                            //console.log("Before Execution of insertRunRuleHistory values"+ values);//Added Subrata 29122020 
                            Database.query(DbQueries.insertRunRuleHistory(values)).then((result) => {
                                //Loggers.serviceGtddlLog.info("After Execution of insertRunRuleHistory result"+ JSON.stringify(result));
                                //console.log(" After insertRunRuleHistory Executed result"+ JSON.stringify(result));//Added Subrata 29122020
                                res.send({
                                    status: true,
                                    results: result
                                });
                                for (let event of socketEvents) {
                                    //console.log(" Inside Router Rule Run History "+"event id "+event.id+" event message "+event.message);
                                    //Loggers.serviceGtddlLog.info(" Inside Router Rule Run History "+" event id "+event.id+" event message "+JSON.stringify(event.message));
                                    //Loggers.serviceGtddlLog.info('Event '+JSON.stringify(event));
                                    req.app.get('socketio').emit(event.id, event.message);
                                }
                            }, (error) => {
                                return next({ status: 500, reason: error });
                            });
                            return;
                        }
                    }
                    break;
            }

        }
        return next({ status: 400 });
    }
}