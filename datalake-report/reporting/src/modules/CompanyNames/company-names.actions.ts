import { Action } from '@ngrx/store';

// Actions
export const GET = '[Company Names] Get';
export const GET_SUCCESS = '[Company Names] Get Success';
export const GET_ERROR = '[Company Names] Get Error';

// Create actions with or without payload
export class GetCompanyNamesAction implements Action {
  readonly type = GET;
  constructor(public payload: string) { }
}

export class GetCompanyNamesSuccessAction implements Action {
  readonly type = GET_SUCCESS;

  constructor(public payload: any) { }
}

export class GetCompanyNamesErrorAction implements Action {
  readonly type = GET_ERROR;

  constructor(public payload: any) { }
}

// Export created actions
export type Actions =
  | GetCompanyNamesAction
  | GetCompanyNamesSuccessAction
  | GetCompanyNamesErrorAction;
