import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import 'codemirror/mode/sql/sql'
import { logMessage } from '../../helpers/LogHelper';
import { GetRuleGroupsAction } from './../../modules/RuleGroups/rule-groups.actions';
import { RuleGroupsState } from '../../modules/RuleGroups/rule-groups.state';
import { Store } from '@ngrx/store';
import { AppStoreState } from '../../app/app.store.state';
import { RuleGroup } from './../../models/ruleGroup.mdl';
import { Observable } from 'rxjs/Observable';
import { ShowSmallMenuAction, ViewGoToSplashAction, ShowLargeMenuAction } from '../../modules/AppViews/app-views.actions';
import { GetIndustryRuleAction } from '../../modules/IndustryRule/industry-rule.actions';
import { IndustryRuleState } from '../../modules/IndustryRule/industry-rule.state';
import { IndustryRule } from '../../models/industryRule.mdl';
import { ViewGoToHRPayrollAction } from '../../modules/hr-payroll/hr-payroll.actions';
import { ViewGoToAuditRulesAction } from '../../modules/AppViews/app-views.actions';
import { LoginAction,  SetUserNameAction } from '../../modules/Auth/auth.actions';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  //@ViewChild('content') nav: NavController; //Commented by Subrata
  authData = {
    username: 'qatest_user',
    password: ''
  };
  isAlive: boolean;
  title: string = '';
  showSmallMenu: boolean = false;
  ruleGroupsState$: Observable<RuleGroupsState>;
  ruleGroups: Array<RuleGroup>;

  industryRuleState$: Observable<IndustryRuleState>;
  industryRule: Array<IndustryRule>;

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams, private store: Store<AppStoreState>, public navCtrl: NavController,) {
      this.isAlive = true;
    this.initializeApp();
  }

  ionViewDidLoad() {
    
  }

  ngAfterViewInit() {
    //this.store.dispatch(new LoginAction(this.authData));
    this.store.dispatch(new SetUserNameAction(this.authData));
    this.getRuleGroup();
  }

  getRuleGroup(){
    this.ruleGroupsState$ = this.store.select(state => state.RuleGroups);
    this.ruleGroupsState$
      .debounceTime(200)
      .filter(state => !!state && !!state.ruleGroups && state.ruleGroups.length > 0)
      .subscribe(response => {
        console.log("Hello 1111");
        this.ruleGroups = response.ruleGroups;
      });
    this.store.dispatch(new GetRuleGroupsAction());
  }

  onRuleGroupExpand(RuleGroupID) {
    console.log("Rule Group "+JSON.stringify(this.ruleGroups));
    console.log("Rule Group Name "+RuleGroupID);
    if (!this.ruleGroups || this.ruleGroups.length <= 0) {
      this.store.dispatch(new GetRuleGroupsAction());
    }
  }

  onRuleGroupClick(ruleGroup){
    console.log("===Subrata 4===="+ruleGroup.RuleGroupID);
    console.log("===Hello 1005==="+ruleGroup.RuleGroupName);
    this.store.dispatch(new GetIndustryRuleAction({rulegroupid: ruleGroup.RuleGroupID}));

    this.industryRuleState$ = this.store.select(state => state.IndustryRules);
    this.industryRuleState$
      .debounceTime(200)
      .filter(state => !!state && !!state.industryRule && state.industryRule.length > 0)
      .subscribe(response => {
        this.industryRule = response.industryRule;
        console.log(this.industryRule);
      });

        /*this.store.select(state => state).subscribe(data => {
          console.log('data', data);
          console.log('data', data['IndustryRules']);
        });*/
        /*this.store.select(state => state.IndustryRules).subscribe(data => {
          console.log('data', data);
        });*/
      //this.store.dispatch(new ViewGoToHRPayrollAction()); 
      this.store.dispatch(new ViewGoToAuditRulesAction(ruleGroup)); 
      this.navCtrl.setRoot('HRPayrollPage');
      this.title = 'HR PayRoll';
  }

  /*onRuleGroupSelect(ruleSubGroup: RuleSubGroup) {
    this.store.dispatch(new GetRuleParamsErrorAction());
    this.store.dispatch(new ResetFeedsAction());
    this.store.dispatch(new ViewGoToReportAction(ruleSubGroup));
  }*/

  initializeApp() {
    logMessage('Init app component');

    // Listen for View state
    this.store
      .select((state) => state.AppViews)
      .takeWhile(res=> this.isAlive)
      .do(response=>{
        this.title = response.title;
        this.showSmallMenu = response.showSmallMenu;
      })
      .distinctUntilChanged()
      .debounceTime(500)
      .subscribe((response) => {
        //this.nav.setRoot(response.page, response.pageData); //Commented By Subrata
      });

    // Load auth state from storage
    // this.storage.get('Auth').then((response) => {
    //   if (response) {
    //     logMessage('Get from storage');

    //     this.store.dispatch(new UpdateFromStorageAction(response));
    //   }
    //   this.authChangeListener();
    // });
  }

  toogleMenu() {
    if (this.showSmallMenu) {
      this.store.dispatch(new ShowLargeMenuAction());
    } else {
      this.store.dispatch(new ShowSmallMenuAction());
    }
  }

  openPage(event:any){
    console.log("============="+JSON.stringify(event));
  }

}
