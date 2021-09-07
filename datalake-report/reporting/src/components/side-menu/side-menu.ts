import { GetRuleGroupsAction } from './../../modules/RuleGroups/rule-groups.actions';
import { RuleSubGroup } from './../../models/ruleSubGroup.mdl';
import { RuleGroup } from './../../models/ruleGroup.mdl';
import { Observable } from 'rxjs/Observable';
import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStoreState } from '../../app/app.store.state';
import { RuleGroupsState } from '../../modules/RuleGroups/rule-groups.state';
import 'rxjs/add/operator/debounceTime';
import { ViewGoToReportAction } from '../../modules/AppViews/app-views.module';
import { GetRuleParamsErrorAction } from './../../modules/rules/rules.actions';
import {ResetFeedsAction } from './../../modules/Feeds/feed.actions';
import { Subject } from 'rxjs';
import { IndustryRuleState } from '../../modules/IndustryRule/industry-rule.state'; //24022021
import { IndustryRule } from '../../models/industryRule.mdl'; //24022021

@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();
  ruleGroupsState$: Observable<RuleGroupsState>;
  ruleGroups: Array<RuleGroup>;

  industryRuleState$: Observable<IndustryRuleState>; //24022021
  industryRule: Array<IndustryRule>; //24022021

  @Input()
  showSmallMenu: boolean;
  constructor(private store: Store<AppStoreState>) {
  }

  ngAfterViewInit() {
    //this.getAllRuleGroups();
    this.getIndustryRules();
  }

  getAllRuleGroups(){
    this.ruleGroupsState$ = this.store.select(state => state.RuleGroups);
    this.ruleGroupsState$
      .debounceTime(200)
      .filter(state => !!state && !!state.ruleGroups && state.ruleGroups.length > 0)
      .subscribe(response => {
        console.log("====Hello 2====");
        console.log("====Response====="+response.ruleGroups);
        this.ruleGroups = response.ruleGroups;
      });
    //this.store.dispatch(new GetRuleGroupsAction());
  }

  getIndustryRules(){
    this.industryRuleState$ = this.store.select(state => state.IndustryRules);
    this.industryRuleState$
      .debounceTime(200)
      .filter(state => !!state && !!state.industryRule && state.industryRule.length > 0)
      .subscribe(response => {
        this.industryRule = response.industryRule;
        console.log(this.industryRule);
      });
  }

  onRuleGroupExpand() {
    if (!this.ruleGroups || this.ruleGroups.length <= 0) {
      this.store.dispatch(new GetRuleGroupsAction());
    }
  }

  onRuleGroupSelect(ruleSubGroup: RuleSubGroup) {
    //reset params/feeds state
    this.store.dispatch(new GetRuleParamsErrorAction());
    this.store.dispatch(new ResetFeedsAction());
    this.store.dispatch(new ViewGoToReportAction(ruleSubGroup));
  }

  clickOnHomeButton() {
    //window.location.href = "http://10.0.3.27:4300/"
    window.location.href = "https://clearrinsights-test.wcgt.in"
  }

  clickOnDashboardButton(){
    window.location.href = "https://clearrinsights-testarn.wcgt.in";
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
}

}
