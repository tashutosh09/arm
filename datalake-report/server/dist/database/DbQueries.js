"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./../Constants");
class DbQueries {
    static pending() {
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
                    ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name} 
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
    static getRuleRunHistoryViaUserQuery(uname) {
        return `SELECT 
                    RuleID,
                    RuleQueryFinalString,
                    RuleRunStartTime,
                    RuleRunEndTime,
                    company_name,
                    RunStatus
                FROM 
                    ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                RuleExecutedByUser='${uname}';`;
    }
    static ruleGroups() {
        return `SELECT *
            FROM 
            ${Constants_1.Constants.TABLES.RULE_GROUP.name} 
            WHERE IsActive=true;`;
    }
    static getIndustryGroup(ruleGroupId) {
        return `SELECT 
            RuleIndustryID,
            RuleIndustryName,
            RuleIndustryIcon,
            RulesubGroupID,
            IsActive,
            RuleGroupID
            FROM 
            ${Constants_1.Constants.TABLES.INDUSTRY_RULE_GROUP.name}
            WHERE RuleGroupID='${ruleGroupId}' 
            AND IsActive=true;`;
    }
    static getSubRuleGroup(industryRuleId) {
        return `SELECT 
            RuleGroupID,
            RuleGroupName,
            RulesubGroupID,
            RulesubGroupname,
            RulesubGroupIcon,
            RuleIndustryID,
            CompanyFlag
            FROM 
            ${Constants_1.Constants.TABLES.SUB_RULE_GROUP.name}
            WHERE RuleIndustryID='${industryRuleId}' 
            AND IsActive=true;`;
    }
    static config() {
        return `SELECT 
                    ConfigName, 
                    ConfigValue 
                FROM 
                    ${Constants_1.Constants.TABLES.CONFIG.name};`;
    }
    static queries(ruleID) {
        return `SELECT 
                    * 
                FROM 
                    ${Constants_1.Constants.TABLES.RULE_QUERY.name} 
                WHERE 
                    ${Constants_1.Constants.TABLES.RULE.key} = '${ruleID}';`;
    }
    static getRunRuleHistoryDetailsForResults(runRuleID) {
        return `SELECT 
                    QueryID,
                    RuleParam,
                    TargetTableName,
                    RuleRunStartTime
                FROM 
                    ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                    RuleRunID='${runRuleID}';`;
    }
    static getQueryResultColumns(queryID) {
        return `SELECT 
                    COALESCE(ResultColumns, '*') ResultColumns
                FROM 
                    ${Constants_1.Constants.TABLES.RULE_QUERY.name} 
                WHERE 
                    ${Constants_1.Constants.TABLES.RULE_QUERY.key}='${queryID}';`;
    }
    static getRunRuleHistoryCount(conditions) {
        return `SELECT 
                    count(1) as total
                FROM 
                    ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                    (${conditions.join(' OR ')});`;
    }
    static getRunRuleHistories(conditions, limit, offset, uname) {
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
                    ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name} trh, tblUserCompanyMap tcm 
                WHERE 
(tcm.UserName = '${uname}' and trh.company_name=tcm.CompanyName) and
                    (${conditions.join(' OR ')})
                ORDER BY 
                    RuleRunStartTime DESC 
                ${limitCondition}
                ${offsetCondition};`;
    }
    static insertRunRuleHistory(rows) {
        return `INSERT INTO 
                    ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name} 
                    (RuleRunID, BatchID, QueryID, RuleID, RuleExecutedByUser, RuleQueryFinalString, TargetTableName, RuleParam, RuleRunStartTime, RunStatus, RunLog, RunResultRowCount, company_name) 
                VALUES 
                    ${rows.join()};`;
    }
    /**
     *  Get list of Rules for given rule Group + LatestRun + LatestQuery
     * @param ruleGroupID
     */
    static rules(RuleSubGroupID, uname) {
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
    static ruleRunHistoryMetaData(user) {
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
                ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name};`;
        }
        else {
            return `SELECT
            count(*) total,
                sum(case when RunStatus = 'FAILED' then 1 else 0 end) failed,
                sum(case when RunStatus = 'COMPLETED' then 1 else 0 end) completed,
                sum(case when RunStatus = 'PENDING' then 1 else 0 end) pending,
                sum(case when RunStatus = 'RUNNING' then 1 else 0 end) running
            FROM 
                ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name};`;
        }
    }
    static running() {
        return `SELECT 
                    count(*) noofrunningrules
                FROM 
                   ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name} 
                WHERE 
                    RunStatus='RUNNING' 
                ORDER BY 
                    RuleRunStartTime limit 1`;
    }
    static updatefailedstatus() {
        return `UPDATE
                   ${Constants_1.Constants.TABLES.RULE_RUN_HISTORY.name}
                SET RunStatus = 'FAILED'
                WHERE
                    RunStatus = 'RUNNING';`;
    }
    //Called For params
    static getParams(ruleIdList) {
        return `SELECT DISTINCT PARAM 
            FROM   ${Constants_1.Constants.TABLES.PARAMS.name}
            WHERE ruleid IN (${ruleIdList});`;
    }
    //get Company Names
    static getCompanyNames(UserName) {
        return `SELECT DISTINCT CompanyName FROM ${Constants_1.Constants.TABLES.COMPANYNAME.name} 
                WHERE UserName = '${UserName}' ;`;
    }
    //insert into User Log
    static insertIntoAuditLog(values) {
        `INSERT INTO tblAuditLog logdetails VALUES('${values}');`;
    }
}
exports.DbQueries = DbQueries;
