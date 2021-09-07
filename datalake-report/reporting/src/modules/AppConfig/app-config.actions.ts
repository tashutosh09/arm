import { Action } from '@ngrx/store';
import { AppConfig } from '../../models/config.mdl';

// Actions
export const GET_CONFIG = '[App Config] Get';
export const GET_CONFIG_SUCCESS = '[App Config] Get Success';
export const GET_CONFIG_ERROR = '[App Config] Get Error';

// Create actions with or without payload
export class GetConfigAction implements Action {
  readonly type = GET_CONFIG;
}

export class GetConfigSuccessAction implements Action {
  readonly type = GET_CONFIG_SUCCESS;

  constructor(public payload: AppConfig[]) { }
}

export class GetConfigErrorAction implements Action {
  readonly type = GET_CONFIG_ERROR;
}

// Export created actions
export type Actions =
  | GetConfigAction
  | GetConfigSuccessAction
  | GetConfigErrorAction;
