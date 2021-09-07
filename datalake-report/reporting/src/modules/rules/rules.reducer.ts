import { Observable } from 'rxjs/Observable';
import { Rule } from './../../models/rule.mdl';
import * as rules from './rules.actions';
import { RulesState, initialRulesState } from './rules.state';

export function rulesReducer(state = initialRulesState, action: rules.Actions): RulesState {
  switch (action.type) {

    case rules.GET_RULE_ALL: {

      return {
        ...state,
        loading: true,
        error: false
      };
    }

    case rules.GET_RULE_ALL_SUCCESS: {

      return {
        ...state,
        loading: false,
        error: false,
        rules: action.payload
      };
    }

    case rules.GET_RULE_ALL_ERROR: {

      return {
        ...state,
        loading: false,
        error: true
      };
    }

    case rules.ON_RULE_SELECT: {

      let newSelectedRules: any[] = Object.assign([], state.selectedRules);
      newSelectedRules.push(action.payload);

      return {
        ...state,
        selectedRules: newSelectedRules
      };
    }

    case rules.ON_RULE_DESELECT: {

      let newSelectedRules: any[] = Object.assign([], state.selectedRules);
      newSelectedRules = newSelectedRules.filter(item => item !== action.payload)

      return {
        ...state,
        selectedRules: newSelectedRules
      };
    }

    case rules.ON_RULE_SELECT_ALL: {
      let nonRunningRules = state.rules
        .filter(res => !!res)
        .filter(rule => {
          return rule.LatestRun == null || (rule.LatestRun.RunStatus != 'PENDING' && rule.LatestRun.RunStatus != 'RUNNING');
        })
        .filter(rule => {
          return action.payload.indexOf(rule) != -1;
        })

      let newSelectedRules: any[] = Object.assign([], nonRunningRules);

      return {
        ...state,
        selectedRules: newSelectedRules
      };
    }

    case rules.ON_RULE_DESELECT_ALL: {

      return {
        ...state,
        selectedRules: []
      };
    }

    case rules.GET_RULE_PARAMS: {

      return {
        ...state,
        ruleParams: []
      };
    }

    case rules.GET_RULE_PARAMS_SUCCESS: {

      return {
        ...state,
        ruleParams: action.payload,
        isRuleParamsEnabled: true
      };
    }

    case rules.GET_RULE_PARAMS_ERROR: {

      return {
        ...state,
        ruleParams: [],
        isRuleParamsEnabled: false
      };
    }

    default: {
      return state;
    }
  }
}
