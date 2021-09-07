import { RuleQuery } from './ruleQuery';
import { RuleRunHistory } from './ruleRunHistory';

export interface Rule {
    RuleID: string;
    RuleGroupID: string;
    RuleSubGroupID: string;
    RuleName: string;
    RuleSystemName: string;
    RuleDescription: string;
    LatestQuery: RuleQuery;
    LatestRun: RuleRunHistory;
    RuleIcon: string;
}
