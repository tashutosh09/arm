import { Rule } from './../../models/rule.mdl';
export interface RulesState {
    loading: boolean;
    error: boolean,
    rules: Rule[];
    ruleParams: any,
    isRuleParamsEnabled: boolean,
    selectedRules?: Rule[];
}

export const initialRulesState: RulesState = {
    loading: false,
    rules: [],
    error: false,
    selectedRules: [],
    ruleParams: [],
    isRuleParamsEnabled: false
}