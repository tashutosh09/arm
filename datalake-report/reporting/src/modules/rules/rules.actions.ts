import { Rule } from './../../models/rule.mdl';
import { Action } from '@ngrx/store';

// Actions
export const GET_RULE_ALL = '[Rules] Get Rule all';
export const GET_RULE_ALL_SUCCESS = '[Rules] Get Rule all Success';
export const GET_RULE_ALL_ERROR = '[Rules] Get Rule all Error';

export const ON_RULE_SELECT = '[Rules] On Rule Select';
export const ON_RULE_DESELECT = '[Rules] On Rule Deselect';

export const ON_RULE_SELECT_ALL = '[Rules] On Rule Select All';
export const ON_RULE_DESELECT_ALL = '[Rules] On Rule Deselect All';


export const GET_RULE_PARAMS = '[Rules] Get Rule Params';
export const GET_RULE_PARAMS_SUCCESS = '[Rules] Get Rule Params Success';
export const GET_RULE_PARAMS_ERROR = '[Rules] Get Rule Params Error';


// Create actions with or without payload
export class GetRuleAllAction implements Action {
  readonly type = GET_RULE_ALL;
  constructor(public payload: any) { }
}

export class GetRuleAllSuccessAction implements Action {
  readonly type = GET_RULE_ALL_SUCCESS;

  constructor(public payload: any) { }
}

export class GetRuleAllErrorAction implements Action {
  readonly type = GET_RULE_ALL_ERROR;
}

export class OnRuleSelectAction implements Action {
  readonly type = ON_RULE_SELECT;
  constructor(public payload: Rule) { }
}

export class OnRuleDeSelectAction implements Action {
  readonly type = ON_RULE_DESELECT;
  constructor(public payload: Rule) { }
}

export class OnRuleSelectAllAction implements Action {
  readonly type = ON_RULE_SELECT_ALL;
  constructor(public payload: Rule[]) { }
}

export class OnRuleDeSelectAllAction implements Action {
  readonly type = ON_RULE_DESELECT_ALL;
}

export class GetRuleParamsAction implements Action {
  readonly type = GET_RULE_PARAMS;
  constructor(public payload: any) { }
}

export class GetRuleParamsSuccessAction implements Action {
  readonly type = GET_RULE_PARAMS_SUCCESS;
  constructor(public payload: any) { }
}

export class GetRuleParamsErrorAction implements Action {
  readonly type = GET_RULE_PARAMS_ERROR;
}


// Export created actions
export type Actions =
  | GetRuleAllAction
  | GetRuleAllSuccessAction
  | GetRuleAllErrorAction
  | OnRuleSelectAction
  | OnRuleDeSelectAction
  | OnRuleSelectAllAction
  | OnRuleDeSelectAllAction
  | GetRuleParamsAction
  | GetRuleParamsSuccessAction
  | GetRuleParamsErrorAction;
