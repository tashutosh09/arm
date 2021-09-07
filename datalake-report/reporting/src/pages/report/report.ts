
import { AppAlert } from './../../helpers/AppAlert';
import { RuleParamsComponent } from './../../components/rule-params/rule-params';
import { GetCompanyNamesAction } from './../../modules/CompanyNames/company-names.actions';
import { AppConfig } from './../../models/config.mdl';
import { RuleRunHistory } from './../../models/ruleRunHistory';
import { RuleRunHistoryService } from './../../modules/RuleRunHistory/rule-run-history.service';
import { RulesService } from './../../modules/rules/rules.service';
import { IMyDpOptions, IMyDate } from 'mydatepicker';
import { Rule } from './../../models/rule.mdl';
import { Observable } from 'rxjs/Observable';
import { RulesState } from './../../modules/rules/rules.state';
import { GetRuleAllAction, OnRuleSelectAllAction, OnRuleDeSelectAllAction, GetRuleParamsAction, GetRuleParamsErrorAction } from './../../modules/rules/rules.actions';
import {ResetFeedsAction } from './../../modules/Feeds/feed.actions';
import { AppStoreState } from './../../app/app.store.state';
import { Store } from '@ngrx/store';
import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { RuleGroup } from '../../models/ruleGroup.mdl';
import { Subject } from 'rxjs/Subject';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinct";
import "rxjs/add/operator/filter";
import { UUID } from 'angular2-uuid';
import { CompanyName } from '../../models/company-name.mdl';
import { logMessage } from '../../helpers/LogHelper';
import { TimerObservable } from "rxjs/observable/TimerObservable";

import 'rxjs/add/operator/distinctUntilChanged';
import { MsalService } from '../../app/msal.service';
//import Database from '../../../../../server/src/database/Database';

//import Database from '../database/Database';

@IonicPage({
  segment: "rules"
})
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  rulesViewAsList: boolean = true;
  ruleGroup: RuleGroup;
  ruleGroupID: string;
  ruleSubGroupID: string;
  rulesState: RulesState;
  rulesToShow: Rule[];
  isAnyRuleSelected: boolean = false;
  selectedRuleCount: number = 0;
  ruleState$: Observable<RulesState>;
  selectAllRules: boolean;
  showParams: boolean;
  isDisabled: boolean = true;
  rulesParams: any;
  //timerCount: number = 0;
  //timerObj;

  @ViewChild('ruleParamsComponent')
  ruleParamsComponent: RuleParamsComponent;

  appConfig: AppConfig[];

  loggedInUserName: string;

  searchTerm$ = new Subject<string>();
  currentSearchTerm: string = '';
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<AppStoreState>,
    private modalCtrl: ModalController,
    private ruleRunHistoryService: RuleRunHistoryService,
    private rulesService: RulesService,
    private toastCtrl: ToastController,
    private appAlert: AppAlert,
    private msalService: MsalService) {
    //console.log("Subrata 11022021 Report "+this.msalService.userProfile().idToken.preferred_username);
    //Start Subrata 11022021
  //   Database.query(DbQueries.insertRunRuleHistory(values)).then((result) => {
  //     //Loggers.serviceGtddlLog.info("After Execution of insertRunRuleHistory result"+ JSON.stringify(result));
  //     //console.log(" After insertRunRuleHistory Executed result"+ JSON.stringify(result));//Added Subrata 29122020
  //     res.send({
  //         status: true,
  //         results: result
  //     });
  //     for (let event of socketEvents) {
  //         //console.log(" Inside Router Rule Run History "+"event id "+event.id+" event message "+event.message);
  //         //Loggers.serviceGtddlLog.info(" Inside Router Rule Run History "+" event id "+event.id+" event message "+JSON.stringify(event.message));
  //         //Loggers.serviceGtddlLog.info('Event '+JSON.stringify(event));
  //         req.app.get('socketio').emit(event.id, event.message);
  //     }
  // }, (error) => {
  //     return next({ status: 500, reason: error });
  // });
    //End Subrata 11022021
    this.isDisabled = true;
    this.ruleGroup = navParams.get('RuleGroup');
    this.ruleGroupID = navParams.get('RuleGroupID');
    this.ruleSubGroupID = (navParams && navParams.data
      && navParams.data.RuleGroup && navParams.data.RuleGroup.RulesubGroupID)
      ? navParams.data.RuleGroup.RulesubGroupID : '';
    if (!this.ruleGroup) {
      this.store.select(state => state.RuleGroups)
        .map(res => res.ruleGroups.filter(res => res.RuleGroupID == this.ruleGroupID))
        .subscribe(response => {
          if (response && response.length > 0) {
            this.ruleGroup = response[0];
            this.store.dispatch(new GetCompanyNamesAction(this.ruleGroup.CompanyFlag));
          }
        })
    } else {
      this.store.dispatch(new GetCompanyNamesAction(this.ruleGroup.CompanyFlag));
    }


    this.store.select(state => state.AppConfig)
      .map(res => res.config)
      .subscribe(config => {
        this.appConfig = config;
      })


    this.ruleState$ = this.store.select(state => state.rules);
    this.ruleState$.subscribe(response => {
      this.rulesState = response;
      //console.log("==Rule State=="+JSON.stringify(this.rulesState));
      this.rulesToShow = this.rulesState.rules;

      let pendingOrRunningRules = this.rulesState.rules
        .filter(res => !!res)
        .filter(rule => {
          return rule.LatestRun == null || (rule.LatestRun.RunStatus != 'PENDING' && rule.LatestRun.RunStatus != 'RUNNING');
        });

      this.selectAllRules = (this.rulesToShow.length > 0) && (pendingOrRunningRules.length === this.rulesState.selectedRules.length);
      this.isAnyRuleSelected = this.rulesState.selectedRules && this.rulesState.selectedRules.length > 0;
      this.selectedRuleCount = this.rulesState.selectedRules.length;

      this.rulesParams = this.rulesState.ruleParams; 
      //console.log("=======Rule Param========="+JSON.stringify(this.rulesParams));
      //Start Subrata

      
      /*var rulesParamsStr = JSON.stringify(this.rulesParams);
      console.log("=======Rule Param========="+rulesParamsStr);
     
      var rulesParams1:any = [{"key":"param.source.tblname","dataType":"table","defaultValue":"table_1","title":"Table1"}];
      for(var ruleparam in this.rulesParams){
        console.log("==Inside For Loop=="+(ruleparam['title']));
        if(JSON.stringify(ruleparam).indexOf('Table1') > -1 && JSON.stringify(ruleparam).indexOf('From Date') > -1
                && JSON.stringify(ruleparam).indexOf('To Date') > -1 ){
          console.log("===ruleparam Continue");
          continue;
        }else{
          console.log("===ruleparam Push===");
          rulesParams1.push(JSON.stringify(ruleparam));
        }
      }
      rulesParams1.push({"key":"param.from.date","dataType":"timestamp","title":"From Date"},{"key":"param.to.date","dataType":"timestamp","title":"To Date"});
      
      this.rulesParams = rulesParams1;*/
      
      //End Subrata
      if (this.rulesState.isRuleParamsEnabled) {
        this.showParams = true;
        this.isDisabled = true
      } else {
        this.showParams = false;
      }


      if (this.currentSearchTerm != null && this.currentSearchTerm != '') {
        this.filterRules();
      }
    });

    this.searchTerm$.debounceTime(400)
      .distinctUntilChanged()
      .do(res => {
        this.rulesToShow = this.rulesState.rules;
      })
      .filter(res => !!res)
      .map(res => res.toLowerCase())
      .subscribe(term => {
        this.currentSearchTerm = term;
        this.filterRules();
      });

  }

  filterRules() {
    this.rulesToShow = this.rulesToShow.filter(rule => {
      return (rule.RuleName.toLowerCase().indexOf(this.currentSearchTerm) !== -1)
        || (rule.RuleDescription.toLowerCase().indexOf(this.currentSearchTerm) !== -1)
    });
  }

  ionViewCanEnter(): Promise<boolean> {
    let self = this;
    return new Promise<boolean>(resolve => {
      this.store.select(state => state.Auth).subscribe(authState => {

        if (authState != null && authState.isReady && authState.isLoggedIn && (self.ruleGroupID != null)) {
          //this.loggedInUserName = authState.systemName;
          if(this.msalService.userProfile() != null){
            this.loggedInUserName = this.msalService.userProfile().idToken.preferred_username;
          }
          logMessage('true');
          resolve(true);
        } else {
          logMessage('true');
          resolve(false);
          this.navCtrl.setRoot('SplashPage');
          //this.navCtrl.setRoot('DashboardPage');
        }
      })
    })
  }

  ionViewDidLoad() {
    this.store.dispatch(new OnRuleDeSelectAllAction());
    this.store.dispatch(new GetRuleAllAction({
      reportId: this.ruleSubGroupID
    }));
    //this.runStatusTimer();
  }


  runRules() {
    console.log("Current date: "+new Date());
    
    if (!this.isDisabled) {
      return;
    }
    if (this.ruleParamsComponent.validateParams()) {
      this.isDisabled = false;
      let rulesToRun: RuleRunHistory[] = new Array<RuleRunHistory>();
      var current_timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
      let allParams = this.ruleParamsComponent.getParams();
      
      for (let config of this.appConfig) {
        allParams[config.ConfigName] = config.ConfigValue;
      }

      for (let item of this.rulesState.selectedRules) {

        let finalQuery = item.LatestQuery.QueryString;
        while (finalQuery.indexOf('${') != -1) {
          for (let item of Object.keys(allParams)) {
            finalQuery = finalQuery.replace('${' + item + '}', `${allParams[item]}`);
          }
        }

        rulesToRun.push({
          RuleRunID: UUID.UUID(),
          RuleID: item.RuleID,
          QueryID: item.LatestQuery.QueryID,
          RuleExecutedByUser: this.loggedInUserName,
          RuleQueryFinalString: finalQuery.replace(/\n/g, " "),
          TargetTableName: item.LatestQuery.TargetTableName,
          RuleParam: JSON.stringify(allParams),
          RuleRunStartTime: current_timestamp
        })
      }
      this.ruleRunHistoryService.add(rulesToRun).subscribe(response => {
        logMessage(response);
        if (response && response.status) {
          this.store.dispatch(new OnRuleDeSelectAllAction());
          this.showParams = false;
        }
      }, error => {
        this.appAlert.showServerError(error.error);
        logMessage(error);
      });

    } else {
      this.appAlert.showError("Provide app parameters");
    }
    //reset feeds state
    this.resetParams();
  }

  onRuleFilter(event) {
    this.currentSearchTerm = event.target.value;
    this.searchTerm$.next(event.target.value);
  }


  addNewRule() {
    this.modalCtrl.create("ManageRulePage", {
      rule: {
        reportId: this.ruleGroupID
      }
    }, { cssClass: 'large-modal' }).present();
  }

  onSelectAllRules() {
    this.selectAllRules = !this.selectAllRules;
    if (this.selectAllRules) {
      this.store.dispatch(new OnRuleSelectAllAction(this.rulesToShow));
    } else {
      this.store.dispatch(new OnRuleDeSelectAllAction());
    }
  }

  getRulesParams() {
    const selectedRuleListId = this.rulesState.selectedRules.map(rule => rule.RuleID);
    this.store.dispatch(new GetRuleParamsAction(selectedRuleListId));
    //this.showParams = true;
    //this.isDisabled = true
  }

  resetParams() {
    this.store.dispatch(new GetRuleParamsErrorAction());
    this.store.dispatch(new ResetFeedsAction());
  }
  /*
   runStatusTimer(){
      this.timerCount = 0;
      this.timerObj = setInterval(() => {     
        console.log("Timmer");    
        console.log(this.timerCount);
  
        this.timerCount = this.timerCount + 1;
      }, 2*60*1000);
      console.log("Timmer Started!");
   }
  
  ngOnDestroy(){
    console.log("Destroy timmer!");
    if(this.timerObj){
      clearInterval(this.timerObj);
    }
  }
  */

}
