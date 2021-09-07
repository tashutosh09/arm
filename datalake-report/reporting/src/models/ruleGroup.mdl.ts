import { RuleSubGroup } from './ruleSubGroup.mdl';
export interface RuleGroup {
    RuleGroupID: string;
    RuleGroupName: string;
    RuleGroupSystemName: string;
    DefaultHiveTable: string;
    CompanyFlag: string;
    RuleGroupIcon: string;
    isOpen: boolean;
    RuleSubGroupList:Array<RuleSubGroup>; 
}
