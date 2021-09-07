import { Action } from '@ngrx/store';

// Actions
export const GET = '[Feeds] Get';
export const GET_SUCCESS = '[Feeds] Get Success';
export const GET_ERROR = '[Feeds] Get Error';
export const RESET_FEEDS = '[Feeds] Reset Feeds';

// Create actions with or without payload
export class GetFeedsAction implements Action {
    readonly type = GET;
    constructor(public payload: string) { }  
} 

export class GetFeedSuccessAction implements Action {
    readonly type = GET_SUCCESS;
  
    constructor(public payload: any) { }
  }
  
  export class GetFeedErrorAction implements Action {
    readonly type = GET_ERROR;
    constructor(public payload: any) { }
  }
  
  export class ResetFeedsAction implements Action {
    readonly type = RESET_FEEDS;
    constructor() {
      console.log('Hi');
     }
  }
  // Export created actions
  export type Actions =
    | GetFeedsAction
    | GetFeedSuccessAction
    | GetFeedErrorAction
    | ResetFeedsAction;