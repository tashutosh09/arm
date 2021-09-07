import { Constants } from './../Constants';
import { Loggers } from './../Logger';
import Database from '../database/Database';
import { Config } from '../Config';
import { DbQueries } from '../database/DbQueries';

export type possibleStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELD';

export class RunHistoryHelper {
    constructor() { }

    public static updateTo(runRuleID: string, RuleExecutedByUser: string, status: possibleStatus, io, resultRowCount: string, log?: string) {
        Loggers.serviceGtddlLog.info("RunHistoryHelper 13 Update To")
        let valuesToUpdate = [];
        valuesToUpdate.push(`RunStatus='${status}'`);
        if (status == 'COMPLETED' || status == 'FAILED') {
            Loggers.serviceGtddlLog.info("Run History Helper");//Added by Subrata
            valuesToUpdate.push(`RuleRunEndTime='${(new Date()).toISOString().slice(0, 19).replace('T', ' ')}'`);
        }
        if (log) {
            valuesToUpdate.push(`RunLog='${log}'`);
        }
        if (resultRowCount != null && resultRowCount != 'null') {
            valuesToUpdate.push(`RunResultRowCount='${resultRowCount}'`)
        }

        Loggers.dbRuleMetadataLog.info(`Status Update Requested RunRuleID[${runRuleID}] RunStatus[${status}] LOG[${log}]`);

        Database.query(`
                        UPDATE ${Constants.TABLES.RULE_RUN_HISTORY.name} 
                        SET 
                            ${valuesToUpdate.join()} 
                        WHERE 
                            ${Constants.TABLES.RULE_RUN_HISTORY.key}='${runRuleID}'`
        )
            .then((result) => {
                Loggers.socketLog.info(`Status Update RunRuleID[${runRuleID}] RunStatus[${status}] LOG[${log}]`);
                console.log("RunRuleID "+runRuleID+" RunStatus "+status+" LOG "+log);
                io.emit(runRuleID, {
                    RuleExecutedByUser: RuleExecutedByUser,
                    RunId: runRuleID,                
                    RunStatus: status
                });
            }, (error) => {
                Database.query(`UPDATE ${Constants.TABLES.RULE_RUN_HISTORY.name} 
                            SET 
                            RunStatus='${status}'
                            WHERE 
                                ${Constants.TABLES.RULE_RUN_HISTORY.key}='${runRuleID}'`);
                Loggers.dbRuleMetadataLog.error(`Status Update Failed ERROR[${error}] RunRuleID[${runRuleID}] RunStatus[${status}] LOG[${log}]`);
            });
    }

    public static getPending(): Promise<any> {
        //Loggers.serviceGtddlLog.info("Inside getPending method");
        return new Promise<any>((resolve, reject) => {
            //console.log("Triggered query for pending : " + DbQueries.pending());//Added by Subrata 29122020
            //Loggers.serviceGtddlLog.info("Triggered query for pending : " + DbQueries.pending());
            Database.query(DbQueries.pending())
                .then((result) => {
                    if (result) {
                        try {
                            let item = JSON.parse(JSON.stringify(result))[0];
                            Loggers.serviceGtddlLog.info("Triggered query for pending : " + DbQueries.pending());
                            //console.log("Inside getPending Item "+item+" Result "+JSON.stringify(result));
                            //Loggers.serviceGtddlLog.info("Inside getPending Item "+item+" Result "+JSON.stringify(result));//Added by Subrata
                            item ? resolve(item) : reject(null);
                        } catch (error) {
                            Loggers.serviceGtddlLog.info("Inside Catch "+error);//Added by Subrata
                            //console.log("Inside Catch "+error);
                            reject(error);
                        }
                    }
                }, (error) => {
                    //console.log("Inside Error "+error);
                    Loggers.serviceGtddlLog.info("Inside Error "+error);
                    reject(error);
                });
        });

    }

    //April2019
    public static getRunning(): Promise<any> {
        return new Promise((resolve, reject) => {
            //Loggers.cronQueryServiceLog.info("Triggered query for running : " + DbQueries.running());
            Database.query(DbQueries.running())
                .then((result) => {
                    if (result) {
                        try {
                            let item = JSON.parse(JSON.stringify(result))[0];
                            item ? resolve(item) : reject(null);
                        } catch (error) {
                            reject(error);
                        }
                    }
                }, (error) => {
                    reject(error);
                });
        });
    }

    static updateRunningStatus(){
        return new Promise((resolve, reject) => {
            //Loggers.cronQueryServiceLog.info("Triggered query for updateRunning : " + DbQueries.updatefailedstatus());
            Database.query(DbQueries.updatefailedstatus())
                .then((result) => {
                    if (result) {
                        try {
                            let item = JSON.parse(JSON.stringify(result))[0];
                            item ? resolve(item) : reject(null);
                        } catch (error) {
                            reject(error);
                        }
                    }
                }, (error) => {
                    reject(error);
                });
        });

    }

    //April2019
    
}