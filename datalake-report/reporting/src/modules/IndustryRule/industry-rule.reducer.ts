import * as industryRule from './industry-rule.actions';
import { IndustryRuleState, initialIndustryRuleState } from './industry-rule.state';

export function industryRuleReducer(state = initialIndustryRuleState, action: industryRule.Actions): IndustryRuleState {
  switch (action.type) {
    case industryRule.GET_ALL_INDUSTRY_RULE: {
      console.log("Hello 29");
      return {
        ...state,
        loading: true,
        error: false
      }
    }

    case industryRule.GET_ALL_INDUSTRY_RULE_SUCCESS: {
      console.log("Hello 30");
      return {
        ...state,
        loading: false,
        error: false,
        industryRule: action.payload
      };
    }

    case industryRule.GET_ALL_INDUSTRY_RULE_ERROR: {
      console.log("Hello 31");
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    default: {
      console.log("Hello 32");
      return state;
    }
  }
}
