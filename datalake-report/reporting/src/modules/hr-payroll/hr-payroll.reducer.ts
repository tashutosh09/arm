import * as hrPayrollViews from './hr-payroll.actions';
import { HRPayrollState, initialHRPayrollState } from './hr-payroll.state';

export function hrPayrollReducer(state = initialHRPayrollState, action: hrPayrollViews.Actions): HRPayrollState {
    switch (action.type) {

        case hrPayrollViews.VIEW_GO_TO_HR_PAYROLL:
            return {
                ...state,
                title: 'HR Payroll',
                page: 'HRPayrollPage'
            };

            case hrPayrollViews.VIEW_GO_TO_HR_PAYROLL_SUCCESS: {

                return {
                  ...state,
                  title: 'HR Payroll',
                page: 'HRPayrollPage'
                };
              }
          
              case hrPayrollViews.VIEW_GO_TO_HR_PAYROLL_ERROR: {
          
                return {
                  ...state,
                  title: 'HR Payroll',
                page: 'HRPayrollPage'
                };
              }

        default:
            return state;

    }
}
