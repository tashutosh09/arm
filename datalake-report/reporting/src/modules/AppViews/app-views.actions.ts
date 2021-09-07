import { RuleSubGroup } from './../../models/ruleSubGroup.mdl';
import { RuleGroup } from './../../models/ruleGroup.mdl';

import { Action } from '@ngrx/store';

export const VIEW_GO_TO_REPORT = '[View] VIEW_GO_TO_REPORT';
export const VIEW_GO_TO_SPLASH = '[View] VIEW_GO_TO_SPLASH';

export const SHOW_SMALL_MENU = '[View] SHOW_SMALL_MENU';
export const SHOW_LARGE_MENU = '[View] SHOW_LARGE_MENU';

export const VIEW_GO_TO_AUDIT_RULES = '[View] VIEW_GO_TO_AUDIT_RULES';

export class ViewGoToSplashAction implements Action {
    readonly type = VIEW_GO_TO_SPLASH;
}

export class ViewGoToReportAction implements Action {
    readonly type = VIEW_GO_TO_REPORT;
    constructor(public payload: RuleSubGroup) { }
}

export class ShowSmallMenuAction implements Action {
    readonly type = SHOW_SMALL_MENU;
}

export class ShowLargeMenuAction implements Action {
    readonly type = SHOW_LARGE_MENU;
}

export class ViewGoToAuditRulesAction implements Action {
    readonly type = VIEW_GO_TO_AUDIT_RULES;
    constructor(public payload: RuleGroup) { }
}


export type Actions =
    ShowSmallMenuAction 
    | ShowLargeMenuAction
    | ViewGoToReportAction | ViewGoToSplashAction | ViewGoToAuditRulesAction;
