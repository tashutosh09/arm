import { IndustryRule } from '../../models/industryRule.mdl';
export interface IndustryRuleState {
    loading: boolean;
    error: boolean;
    industryRule: Array<IndustryRule>;
}

export const initialIndustryRuleState: IndustryRuleState = {
    loading: false,
    industryRule: [],
    error: false
}