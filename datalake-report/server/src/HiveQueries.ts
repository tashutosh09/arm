import { Config } from './Config';
import { toFormatedDateTime } from './common_code/CommonHelper';

export interface HiveRunRuleParameters {
    RuleParam: string;
    TargetTableName: string;
    RuleRunID: string;
    RuleID: string;
    QueryID: string;
    BatchID: string;
    RuleExecutedByUser: string;
    RuleRunStartTime: string;
    RuleQueryFinalString: string;
}

export class HiveQueries {
    config = Config;

    public static getHivePartitionQuery(): String {
        return 'set hive.exec.dynamic.partition.mode=nonstrict';
    }

    public static runRuleQuery(data: HiveRunRuleParameters): string {
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
            '${toFormatedDateTime(data.RuleRunStartTime)}' system_processingtime
        from
        (
            ${data.RuleQueryFinalString}
        ) RESULT`
    }

    // public static getRuleRunResults(resultCols: string, dbName: string, tblName: string, runRuleID: string) {
    //     return `Select 
    //             ${resultCols}
    //             from ${dbName}.${tblName} 
    //             where system_rulerunid='${runRuleID}'`;
    // }

    public static getRuleRunResults(resultCols: string, dbName: string, tblName: string, system_CompanySystemName: string, system_processingtime: string) {
        return `Select 
                ${resultCols}
                    from ${dbName}.${tblName} 
                where 
                    system_CompanySystemName='${system_CompanySystemName}'
                    and 
                    system_processingtime='${system_processingtime}'`;
    }

    public static getQueryForRunResultCountFromHive(data: HiveRunRuleParameters) {
        let params = JSON.parse(data.RuleParam);
        return `Select 
                    COUNT(1) as total 
                FROM 
                    ${params['config.auditruledb.name']}.${data.TargetTableName}
                WHERE 
                        system_CompanySystemName='${params['param.source.dbname']}'
                    AND 
                        system_processingtime='${toFormatedDateTime(data.RuleRunStartTime)}'`;
    }

    public static getRuleRunResultsForBatchID(resultCols: string, dbName: string, tblName: string, batchID: string) {
        return `Select 
                ${resultCols}
                from ${dbName}.${tblName} 
                where system_batchid='${batchID}'`;
    }
}