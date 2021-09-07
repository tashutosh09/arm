import * as appViews from './app-views.actions';
import { AppViewsState, initialAppViewsState } from './app-views.state';

export function appViewsReducer(state = initialAppViewsState, action: appViews.Actions): AppViewsState {
    switch (action.type) {

        case appViews.VIEW_GO_TO_REPORT:
            return {
                ...state,
                title: action.payload.RuleGroupName,
                page: 'ReportPage',
                pageData: {
                    RuleGroup: action.payload,
                    RuleGroupID: action.payload.RuleGroupID
                }
            };

        case appViews.VIEW_GO_TO_SPLASH:
            return {
                ...state,
                title: 'Audit Reporting',
                //page: 'SplashPage'
                page: 'DashboardPage'
            };

        case appViews.SHOW_LARGE_MENU:
            return{
                ...state,
                showSmallMenu: false
            }
        case appViews.SHOW_SMALL_MENU:
            return{
                ...state,
                showSmallMenu: true
            }

        case appViews.VIEW_GO_TO_AUDIT_RULES:
            return {
                ...state,
                title: action.payload.RuleGroupName,
                page: 'HRPayrollPage'
            };

        default:
            return state;

    }
}
