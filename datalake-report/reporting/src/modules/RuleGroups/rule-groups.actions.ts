import { RuleGroup } from './../../models/ruleGroup.mdl';
import { Action } from '@ngrx/store';

// Actions
export const GET_ALL_RULE_GROUPS = '[RULE_GROUPS] Get All';
export const GET_ALL_RULE_GROUPS_SUCCESS = '[RULE_GROUPS] Get All Success';
export const GET_ALL_RULE_GROUPS_ERROR = '[RULE_GROUPS] Get All Error';

// Create actions with or without payload
export class GetRuleGroupsAction implements Action {
  readonly type = GET_ALL_RULE_GROUPS;
}

export class GetRuleGroupsSuccessAction implements Action {
  readonly type = GET_ALL_RULE_GROUPS_SUCCESS;

  constructor(public payload: Array<RuleGroup>) { }
}

export class GetRuleGroupsErrorAction implements Action {
  readonly type = GET_ALL_RULE_GROUPS_ERROR;
}

// Export created actions
export type Actions =
  | GetRuleGroupsAction
  | GetRuleGroupsSuccessAction
  | GetRuleGroupsErrorAction;
