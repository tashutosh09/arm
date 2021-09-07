import { RuleSubGroup } from './../../models/ruleSubGroup.mdl';

import { Action } from '@ngrx/store';

export const VIEW_GO_TO_HR_PAYROLL = '[HR_PAYROLL] VIEW_GO_TO_HR_PAYROLL';
export const VIEW_GO_TO_HR_PAYROLL_SUCCESS = '[HR_PAYROLL] VIEW_GO_TO_HR_PAYROLL_SUCCESS';
export const VIEW_GO_TO_HR_PAYROLL_ERROR = '[HR_PAYROLL] VIEW_GO_TO_HR_PAYROLL_ERROR';

export class ViewGoToHRPayrollAction implements Action {
    readonly type = VIEW_GO_TO_HR_PAYROLL;
    constructor() {
        console.log("Hello 1000");
     }  
}

export class ViewGoToHRPayrollActionSuccess implements Action {
    readonly type = VIEW_GO_TO_HR_PAYROLL_SUCCESS;
  
    constructor(public payload: any) { }
  }
  
  export class ViewGoToHRPayrollActionError implements Action {
    readonly type = VIEW_GO_TO_HR_PAYROLL_ERROR;
  }


export type Actions = ViewGoToHRPayrollAction
| ViewGoToHRPayrollActionSuccess
| ViewGoToHRPayrollActionError;
