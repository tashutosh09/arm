import * as ruleGroups from './rule-groups.actions';
import { RuleGroupsState, initialRuleGroupsState } from './rule-groups.state';

export function ruleGroupsReducer(state = initialRuleGroupsState, action: ruleGroups.Actions): RuleGroupsState {
  switch (action.type) {
    case ruleGroups.GET_ALL_RULE_GROUPS: {
      return {
        ...state,
        loading: true,
        error: false
      }
    }

    case ruleGroups.GET_ALL_RULE_GROUPS_SUCCESS: {

      return {
        ...state,
        loading: false,
        error: false,
        ruleGroups: action.payload
      };
    }

    case ruleGroups.GET_ALL_RULE_GROUPS_ERROR: {

      return {
        ...state,
        loading: false,
        error: true
      };
    }

    default: {
      return state;
    }
  }
}
