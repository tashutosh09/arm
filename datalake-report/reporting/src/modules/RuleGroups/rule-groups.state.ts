import { RuleGroup } from './../../models/ruleGroup.mdl';
import { IndustryRule } from './../../models/industryRule.mdl';
import { RuleSubGroup } from './../../models/ruleSubGroup.mdl';
export interface RuleGroupsState {
    loading: boolean;
    error: boolean;
    selecedtRuleGroup: RuleGroup;
    selectedindustryRule: IndustryRule;
    selectedSubRuleGroup: RuleSubGroup;
    ruleGroups: Array<RuleGroup>;
}

export const initialRuleGroupsState: RuleGroupsState = {
    loading: false,
    selecedtRuleGroup: null,
    selectedindustryRule: null,
    selectedSubRuleGroup: null,
    ruleGroups: [],
    error: false
}