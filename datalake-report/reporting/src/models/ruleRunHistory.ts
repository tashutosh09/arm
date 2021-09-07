export interface RuleRunHistory {
    RuleRunID: string;
    BatchID?: string;   // Generated from server
    RuleID: string;
    QueryID: string;
    RuleExecutedByUser: string;
    RuleQueryFinalString: string;
    TargetTableName: string;
    RuleParam: string;
    RuleRunStartTime: any;
    RuleRunEndTime?: any;   // Updated from server
    RunStatus?: string;  // Set by server
    RunLog?: string; // Set by server
    RunResultRowCount?: string;
}
