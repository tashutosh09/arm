"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const CommonHelper_1 = require("./common_code/CommonHelper");
class HiveQueries {
    constructor() {
        this.config = Config_1.Config;
    }
    static getHivePartitionQuery() {
        return 'set hive.exec.dynamic.partition.mode=nonstrict';
    }
    static runRuleQuery(data) {
        let params = JSON.parse(data.RuleParam);
        return `
        insert into 
            ${params['config.auditruledb.name']}.${data.TargetTableName} 
        PARTITION 
            (system_CompanySystemName, system_processingtime)
        Select 
            RESULT.*,
            '${data.RuleRunID}' system_rulerunid,
            '${data.RuleID}' system_ruleid,
            '${data.QueryID}' system_queryid,
            '${data.BatchID}' system_batchid,
            '${data.RuleExecutedByUser}' system_ruleexecutedbyuser,
            '${JSON.stringify(params)}' system_ruleparam,
            '${params['param.source.dbname']}' system_companysystemname,
            '${CommonHelper_1.toFormatedDateTime(data.RuleRunStartTime)}' system_processingtime
        from
        (
            ${data.RuleQueryFinalString}
        ) RESULT`;
    }
    // public static getRuleRunResults(resultCols: string, dbName: string, tblName: string, runRuleID: string) {
    //     return `Select 
    //             ${resultCols}
    //             from ${dbName}.${tblName} 
    //             where system_rulerunid='${runRuleID}'`;
    // }
    static getRuleRunResults(resultCols, dbName, tblName, system_CompanySystemName, system_processingtime) {
        return `Select 
                ${resultCols}
                    from ${dbName}.${tblName} 
                where 
                    system_CompanySystemName='${system_CompanySystemName}'
                    and 
                    system_processingtime='${system_processingtime}'`;
    }
    static getQueryForRunResultCountFromHive(data) {
        let params = JSON.parse(data.RuleParam);
        return `Select 
                    COUNT(1) as total 
                FROM 
                    ${params['config.auditruledb.name']}.${data.TargetTableName}
                WHERE 
                        system_CompanySystemName='${params['param.source.dbname']}'
                    AND 
                        system_processingtime='${CommonHelper_1.toFormatedDateTime(data.RuleRunStartTime)}'`;
    }
    static getRuleRunResultsForBatchID(resultCols, dbName, tblName, batchID) {
        return `Select 
                ${resultCols}
                from ${dbName}.${tblName} 
                where system_batchid='${batchID}'`;
    }
}
exports.HiveQueries = HiveQueries;
