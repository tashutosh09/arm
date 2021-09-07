import { AppViewsState } from './../modules/AppViews/app-views.state';
import { MetaDataState } from './../modules/MetaData/meta-data.state';
import { AuthState } from './../modules/Auth/auth.state';
import { CompanyNamesState } from './../modules/CompanyNames/company-names.state';
import { FeedState } from './../modules/Feeds/feed.state';
import { RulesState } from './../modules/rules/rules.state';
import { RuleGroupsState } from '../modules/RuleGroups/rule-groups.state';
import { AppConfigState } from '../modules/AppConfig/app-config.state';
import { IndustryRuleState } from '../modules/IndustryRule/industry-rule.state'; //24020221

export interface AppStoreState {
    AppViews: AppViewsState;
    RuleGroups: RuleGroupsState;
    IndustryRules: IndustryRuleState;
    rules: RulesState;
    CompanyNames: CompanyNamesState;
    Feed: FeedState;
    AppConfig: AppConfigState;
    Auth: AuthState;
    MetaData: MetaDataState;
}
