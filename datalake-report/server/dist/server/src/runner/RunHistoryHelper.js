"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./../Constants");
const Logger_1 = require("./../Logger");
const Database_1 = require("../database/Database");
const DbQueries_1 = require("../database/DbQueries");
class RunHistoryHelper {
    constructor() { }
    static updateTo(runRuleID, RuleExecutedByUser, status, io, resultRowCount, log) {
        let valuesToUpdate = [];
        valuesToUpdate.push(`RunStatus='${status}'`);
        if (status == 'COMPLETED' || status == 'FAILED') {
            valuesToUpdate.push(`RuleRunEndTime='${(new Date()).toISOString().slice(0, 19).replace('T', ' ')}'`);
        }
        if (log) {
            valuesToUpdate.push(`RunLog='${log}'`);
        }
        if (resultRowCount != null && resultRowCount != 'null') {
            valuesToUpdate.push(`RunResultRowCount='${resultRowCount}'`);
        }
        Logger_1.Loggers.dbRuleMetadataLog.info(`Status Update Requested RunRuleID[${runRuleID}] RunStatus[${status}] LOG[${log}]`);
        Database_1.default.query(`
                        UPDATE ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name} 
                        SET 
                            ${valuesToUpdate.join()} 
                        WHERE 
                            ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.key}='${runRuleID}'`)
            .then((result) => {
            Logger_1.Loggers.socketLog.info(`Status Update RunRuleID[${runRuleID}] RunStatus[${status}] LOG[${log}]`);
            io.emit(runRuleID, {
                RuleExecutedByUser: RuleExecutedByUser,
                RunId: runRuleID,
                RunStatus: status
            });
        }, (error) => {
            Database_1.default.query(`UPDATE ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name} 
                            SET 
                            RunStatus='${status}'
                            WHERE 
                                ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.key}='${runRuleID}'`);
            Logger_1.Loggers.dbRuleMetadataLog.error(`Status Update Failed ERROR[${error}] RunRuleID[${runRuleID}] RunStatus[${status}] LOG[${log}]`);
        });
    }
    static getPending() {
        return new Promise((resolve, reject) => {
            Database_1.default.query(DbQueries_1.DbQueries.pending())
                .then((result) => {
                if (result) {
                    try {
                        let item = JSON.parse(JSON.stringify(result))[0];
                        item ? resolve(item) : reject(null);
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            }, (error) => {
                reject(error);
            });
        });
    }
    //April2019
    static getRunning() {
        return new Promise((resolve, reject) => {
            Logger_1.Loggers.cronQueryServiceLog.info("Triggered query for running : " + DbQueries_1.DbQueries.running());
            Database_1.default.query(DbQueries_1.DbQueries.running())
                .then((result) => {
                if (result) {
                    try {
                        let item = JSON.parse(JSON.stringify(result))[0];
                        item ? resolve(item) : reject(null);
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            }, (error) => {
                reject(error);
            });
        });
    }
    static updateRunningStatus() {
        return new Promise((resolve, reject) => {
            Logger_1.Loggers.cronQueryServiceLog.info("Triggered query for updateRunning : " + DbQueries_1.DbQueries.updatefailedstatus());
            Database_1.default.query(DbQueries_1.DbQueries.updatefailedstatus())
                .then((result) => {
                if (result) {
                    try {
                        let item = JSON.parse(JSON.stringify(result))[0];
                        item ? resolve(item) : reject(null);
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            }, (error) => {
                reject(error);
            });
        });
    }
}
exports.RunHistoryHelper = RunHistoryHelper;
