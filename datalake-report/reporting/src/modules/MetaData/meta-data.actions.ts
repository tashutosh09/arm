import { Action } from '@ngrx/store';

// Actions
export const GET = '[Rule Meta Data] Get';
export const GET_SUCCESS = '[Rule Meta Data] Get Success';
export const GET_ERROR = '[Rule Meta Data] Get Error';

// Create actions with or without payload
export class GetRuleMetaDataAction implements Action {
  readonly type = GET;
  constructor(public payload: any) { }
}

export class GetRuleMetaDataSuccessAction implements Action {
  readonly type = GET_SUCCESS;

  constructor(public payload: any) { }
}

export class GetRuleMetaDataErrorAction implements Action {
  readonly type = GET_ERROR;

  constructor(public payload: any) { }
}

// Export created actions
export type Actions =
  | GetRuleMetaDataAction
  | GetRuleMetaDataSuccessAction
  | GetRuleMetaDataErrorAction;
