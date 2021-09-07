import { AuthState } from './auth.state';
import { Action } from '@ngrx/store';

// Actions
export const LOGIN = '[Auth] LOGIN';
export const LOGIN_SUCCESS = '[Auth] LOGIN Success';
export const LOGIN_ERROR = '[Auth] LOGIN Error';

export const LOGOUT = '[Auth] LOGOUT';

export const UPDATE_FROM_STORAGE = '[Auth] UPDATE_FROM_STORAGE';

export const SET_USER_NAME = '[Auth] SET_USER_NAME';


// Create actions with or without payload
export class LoginAction implements Action {
  readonly type = LOGIN;
  constructor(public payload: {
    username: string,
    password: string
  }) { }
}

export class LoginSuccessAction implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: any) { }
}

export class LoginErrorAction implements Action {
  readonly type = LOGIN_ERROR;

  constructor(public payload: any) { }
}

export class LogoutAction implements Action {
  readonly type = LOGOUT;
}

export class UpdateFromStorageAction implements Action {
  readonly type = UPDATE_FROM_STORAGE;
  constructor(public payload: AuthState) { }
}

export class SetUserNameAction implements Action{
  readonly type = SET_USER_NAME;
  constructor(public payload: {
    username: string,
    password: string
  }) { }
}

// Export created actions
export type Actions =
  | LoginAction
  | LoginSuccessAction
  | LoginErrorAction
  | LogoutAction
  | UpdateFromStorageAction
  | SetUserNameAction;
