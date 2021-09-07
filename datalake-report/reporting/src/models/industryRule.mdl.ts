import { RuleSubGroup } from './ruleSubGroup.mdl';
export interface IndustryRule {
    RuleIndustryID: string;
    RuleIndustryName: string;
    RuleGroupID: String;
    RuleGroupName: String;
    RuleSubGroupID: String;
    RuleSubGroupName: String;
    IsActive: String;
    RuleIndustryIcon: String;
    RuleIndustrySystemName: String;
    DefaultHiveTable: string;
}
