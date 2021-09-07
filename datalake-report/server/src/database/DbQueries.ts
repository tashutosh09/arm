import { Constants } from './../Constants';

export class DbQueries {

    public static pending() {
        return `SELECT 
                    RuleRunID,
                    RuleID,
                    QueryID,
                    BatchID,
                    RuleExecutedByUser,
                    RuleQueryFinalString,
                    RuleParam,
                    RuleRunStartTime,
                    RuleRunEndTime,
                    RunStatus,
                    TargetTableName,
                    RunResultRowCount
                FROM 
                    ${Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                    RunStatus='PENDING' 
                ORDER BY 
                    RuleRunStartTime DESC limit 1`; //Commented By Subrata

        /*return `SELECT 
                    ROWID,
                    RuleRunID,
                    RuleID,
                    QueryID,
                    BatchID,
                    RuleExecutedByUser,
                    RuleQueryFinalString,
                    RuleParam,
                    RuleRunStartTime,
                    RuleRunEndTime,
                    RunStatus,
                    TargetTableName,
                    RunResultRowCount
                FROM 
                    ${Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                    RunStatus='PENDING' 
                ORDER BY 
                    ROWID DESC limit 1`;*/

                    
    }

    public static getRuleRunHistoryViaUserQuery(uname: string) {
        return `SELECT 
                    RuleID,
                    RuleQueryFinalString,
                    RuleRunStartTime,
                    RuleRunEndTime,
                    company_name,
                    RunStatus
                FROM 
                    ${Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                RuleExecutedByUser='${uname}';`;
    }

    public static ruleGroups(): string {
        return `SELECT *
            FROM 
            ${Constants.TABLES.RULE_GROUP.name} 
            WHERE IsActive=true;`
    }

    public static getIndustryGroup(ruleGroupId: string): string {
        return `SELECT 
            RuleIndustryID,
            RuleIndustryName,
            RuleIndustryIcon,
            RulesubGroupID,
            IsActive,
            RuleGroupID
            FROM 
            ${Constants.TABLES.INDUSTRY_RULE_GROUP.name}
            WHERE RuleGroupID='${ruleGroupId}' 
            AND IsActive=true;`
    }

    public static getSubRuleGroup(industryRuleId: string): string {
        return `SELECT 
            RuleGroupID,
            RuleGroupName,
            RulesubGroupID,
            RulesubGroupname,
            RulesubGroupIcon,
            RuleIndustryID,
            CompanyFlag
            FROM 
            ${Constants.TABLES.SUB_RULE_GROUP.name}
            WHERE RuleIndustryID='${industryRuleId}' 
            AND IsActive=true;`
    }

    public static config() {
        return `SELECT 
                    ConfigName, 
                    ConfigValue 
                FROM 
                    ${Constants.TABLES.CONFIG.name};`;
    }

    public static queries(ruleID: string) {
        return `SELECT 
                    * 
                FROM 
                    ${Constants.TABLES.RULE_QUERY.name} 
                WHERE 
                    ${Constants.TABLES.RULE.key} = '${ruleID}';`;
    }

    public static getRunRuleHistoryDetailsForResults(runRuleID: string) {
        return `SELECT 
                    QueryID,
                    RuleParam,
                    TargetTableName,
                    RuleRunStartTime
                FROM 
                    ${Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                    RuleRunID='${runRuleID}';`;
    }

    public static getQueryResultColumns(queryID: string) {
        return `SELECT 
                    COALESCE(ResultColumns, '*') ResultColumns
                FROM 
                    ${Constants.TABLES.RULE_QUERY.name} 
                WHERE 
                    ${Constants.TABLES.RULE_QUERY.key}='${queryID}';`;
    }

    public static getRunRuleHistoryCount(conditions: any) {
        return `SELECT 
                    count(1) as total
                FROM 
                    ${Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                    (${conditions.join(' OR ')});`
    }

    public static getRunRuleHistories(conditions, limit, offset, uname: string) {
        let limitCondition = '';
        let offsetCondition = '';

        if (offset) {
            offsetCondition = `OFFSET ${offset}`;
        }

        if (limit) {
            limitCondition = `LIMIT ${limit}`;
        }
        return `SELECT 
                    *
                FROM 
                    ${Constants.TABLES.RULE_RUN_HISTORY.name} trh, tblUserCompanyMap tcm 
                WHERE 
(tcm.UserName = '${uname}' and trh.company_name=tcm.CompanyName) and
                    (${conditions.join(' OR ')})
                ORDER BY 
                    RuleRunStartTime DESC 
                ${limitCondition}
                ${offsetCondition};`;
    }

    public static insertRunRuleHistory(rows) {
        return `INSERT INTO 
                    ${Constants.TABLES.RULE_RUN_HISTORY.name} 
                    (RuleRunID, BatchID, QueryID, RuleID, RuleExecutedByUser, RuleQueryFinalString, TargetTableName, RuleParam, RuleRunStartTime, RunStatus, RunLog, RunResultRowCount, company_name) 
                VALUES 
                    ${rows.join()};`
    }

    /**
     *  Get list of Rules for given rule Group + LatestRun + LatestQuery
     * @param ruleGroupID
     */
    public static rules(RuleSubGroupID: string, uname: string) {
        return `
                Select 
                    latestRecords.RuleID,
                    latestRecords.RuleGroupID,
                    latestRecords.RuleSubGroupID,
                    latestRecords.RuleName,
                    latestRecords.RuleSystemName,
                    latestRecords.RuleDescription,
                    latestRecords.RuleIcon,
                    
                    case when Qresult.QueryID is null then null else
                    JSON_OBJECT(
                        'QueryID', Qresult.QueryID,
                        'VersionTimeStamp', Qresult.VersionTimeStamp,
                        'TargetTableName', Qresult.TargetTableName,
                        'QueryString', Qresult.QueryString) end as 'LatestQuery',
                    
                        case when Hresult.RuleRunID is null then null else
                    JSON_OBJECT(
                        'RuleRunID', Hresult.RuleRunID,
                        'QueryID',  Hresult.QueryID,
                        'BatchID', Hresult.BatchID,
                        'RuleExecutedByUser',  Hresult.RuleExecutedByUser,
                        'RuleQueryFinalString',  Hresult.RuleQueryFinalString,
                        'RuleParam',  Hresult.RuleParam,
                        'RuleRunStartTime',  Hresult.RuleRunStartTime,
                        'RuleRunEndTime',  Hresult.RuleRunEndTime,
                        'RunStatus',  Hresult.RunStatus,
                        'RunLog',  Hresult.RunLog) end as 'LatestRun',
                        'RunResultRowCount',  Hresult.RunResultRowCount
                FROM 
                    (
                        SELECT 
                            R.RuleID,
                            R.RuleGroupID,
                            R.RuleSubGroupID,
                            R.RuleName,
                            R.RuleDescription,
                            R.RuleIcon,
                            R.IsActive,
                            R.RuleSystemName,
                            max(RH.RuleRunStartTime) latestStartTime,
                            max(Q.VersionTimeStamp) latestQueryVersionTime
                        FROM 
                            tblRule R
                                left join tblRuleRunHistory RH
                                    on (R.RuleID = RH.RuleID and RH.RuleExecutedByUser = '${uname}') 
                                left outer join tblRuleQuery Q
                                    on (R.RuleID = Q.RuleID)
                        where 
                            R.RuleSubGroupID = '${RuleSubGroupID}' AND R.IsActive=true
                        group by 
                            R.RuleID,
                            R.RuleGroupID,
                            R.RuleSubGroupID,
                            R.RuleName,
                            R.RuleDescription,
                            R.RuleIcon,
                            R.RuleSystemName
                    ) latestRecords
                left outer join tblRuleRunHistory Hresult
                    on (Hresult.RuleExecutedByUser = '${uname}' and Hresult.RuleID = latestRecords.RuleID and Hresult.RuleRunStartTime = latestRecords.latestStartTime and Hresult.company_name in (select CompanyName from tblUserCompanyMap where UserName = '${uname}'))
                left outer join tblRuleQuery Qresult
                    on latestRecords.RuleID = Qresult.RuleID and latestRecords.latestQueryVersionTime = Qresult.VersionTimeStamp;
        `;
    }

    public static ruleRunHistoryMetaData(user?: string) {
        if (user) {
            return `SELECT
                count(*) total,
                sum(case when RunStatus = 'FAILED' then 1 else 0 end) failed,
                sum(case when RunStatus = 'COMPLETED' then 1 else 0 end) completed,
                sum(case when RunStatus = 'PENDING' then 1 else 0 end) pending,
                sum(case when RunStatus = 'RUNNING' then 1 else 0 end) running,

                sum(case when RuleExecutedByUser = '${user}' then 1 else 0 end) my_total,
                sum(case when RunStatus = 'FAILED' and RuleExecutedByUser = '${user}' then 1 else 0 end) my_failed,
                sum(case when RunStatus = 'COMPLETED' and RuleExecutedByUser = '${user}' then 1 else 0 end) my_completed,
                sum(case when RunStatus = 'PENDING' and RuleExecutedByUser = '${user}' then 1 else 0 end) my_pending,
                sum(case when RunStatus = 'RUNNING' and RuleExecutedByUser = '${user}' then 1 else 0 end) my_running
            FROM 
                ${Constants.TABLES.RULE_RUN_HISTORY.name};`;
        } else {
            return `SELECT
            count(*) total,
                sum(case when RunStatus = 'FAILED' then 1 else 0 end) failed,
                sum(case when RunStatus = 'COMPLETED' then 1 else 0 end) completed,
                sum(case when RunStatus = 'PENDING' then 1 else 0 end) pending,
                sum(case when RunStatus = 'RUNNING' then 1 else 0 end) running
            FROM 
                ${Constants.TABLES.RULE_RUN_HISTORY.name};`;
        }



    }

    public static running() {
        return `SELECT 
                    count(*) noofrunningrules
                FROM 
                   ${Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                    RunStatus='RUNNING' 
                ORDER BY 
                    RuleRunStartTime limit 1`;
    }

    public static updatefailedstatus() {
        return `UPDATE
                   ${Constants.TABLES.RULE_RUN_HISTORY.name}
                SET RunStatus = 'FAILED'
                WHERE
                    RunStatus = 'RUNNING';`;
    }

    //Called For params
    public static getParams(ruleIdList) {
        return `SELECT DISTINCT PARAM 
            FROM   ${Constants.TABLES.PARAMS.name}
            WHERE ruleid IN (${ruleIdList});`
    }

    //get Company Names
    public static getCompanyNames(UserName){
        return `SELECT DISTINCT CompanyName FROM ${Constants.TABLES.COMPANYNAME.name} 
                WHERE UserName = '${UserName}' ;`;
    }

    //insert into User Log
    public static insertIntoAuditLog(values){
        `INSERT INTO tblAuditLog logdetails VALUES('${values}');`;
    }
}
