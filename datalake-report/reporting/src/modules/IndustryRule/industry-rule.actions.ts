import { IndustryRule } from '../../models/industryRule.mdl';
import { Action } from '@ngrx/store';

// Actions
export const GET_ALL_INDUSTRY_RULE = '[INDUSTRY_RULE] Get All INDUSTRY';
export const GET_ALL_INDUSTRY_RULE_SUCCESS = '[INDUSTRY_RULE] Get All INDUSTRY Success';
export const GET_ALL_INDUSTRY_RULE_ERROR = '[INDUSTRY_RULE] Get All INDUSTRY Error';

// Create actions with or without payload
export class GetIndustryRuleAction implements Action {
  readonly type = GET_ALL_INDUSTRY_RULE;
  constructor(public payload: {
    rulegroupid: string
  }) { }
}

export class GetIndustryRuleSuccessAction implements Action {
  readonly type = GET_ALL_INDUSTRY_RULE_SUCCESS;
  
  constructor(public payload: Array<IndustryRule>) { }
}

export class GetIndustryRuleErrorAction implements Action {
  readonly type = GET_ALL_INDUSTRY_RULE_ERROR;
}

// Export created actions
export type Actions =
  | GetIndustryRuleAction
  | GetIndustryRuleSuccessAction
  | GetIndustryRuleErrorAction;
