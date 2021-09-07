import { IOSocket } from './../../modules/IOSocket/io.socket.module';
import { RuleRunHistory } from './../../models/ruleRunHistory';
import { RulesState } from './../../modules/rules/rules.state';
import { Observable } from 'rxjs/Observable';
import { OnRuleSelectAction, OnRuleDeSelectAction } from './../../modules/rules/rules.actions';
import { Store } from '@ngrx/store';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Input } from '@angular/core';
import { AppStoreState } from '../../app/app.store.state';
import { ModalController } from 'ionic-angular';
import 'rxjs/add/operator/filter';
import { ChangeDetectorRef } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { getRuleStatusColor } from '../../helpers/ColorHelper';
import { logMessage } from '../../helpers/LogHelper';
import { AuthState } from './../../modules/Auth/auth.state';
import { DatePipe } from '@angular/common';

import { RulesService } from './../../modules/rules/rules.service';

import { MsalService } from '../../app/msal.service';
import { SetUserNameAction } from '../../modules/Auth/auth.actions';
import { Subject } from 'rxjs';

@Component({
  selector: 'rule',
  templateUrl: 'rule.html'
})
export class RuleComponent implements AfterViewInit, OnDestroy {
  //private ngUnsubscribe = new Subject();
  private timerCount: number = 0;
  private timerObj;
authState: AuthState;
  @Input()
  rule: any;

  @Input()
  viewOnly: boolean;

  selected: boolean = false;

  ruleState$: Observable<RulesState>

  runHistoryIconColor: string;

  canSelect: boolean = true;
 id: any;
 ruleRunStartTime: any;
 datePipe = new DatePipe("en-US");

  constructor(private store: Store<AppStoreState>,
    private modalCtrl: ModalController,
    private socket: IOSocket,
    private cdRef: ChangeDetectorRef,
    private toastCtrl: ToastController,
    private rulesService: RulesService, 
    private msalService: MsalService) {
    this.ruleState$ =
      this.store
        .select(state => state.rules);

this.store.select(state => state.Auth)
    .filter(response => response.isLoggedIn && !!response.systemName)
    .subscribe(authState => {
      console.warn(authState.systemName);
      this.authState = authState;

    });
  }

  ngAfterViewInit() {
    
    if (this.rule.LatestRun) {
      this.ruleRunStartTime = this.datePipe.transform(this.rule.LatestRun.RuleRunStartTime, 'yyyy-MM-dd HH-mm-ss','+1100');
      this.registerForLatestRunStatus();
    }

    this.socket.connect();

    //Boenci
    this.socket.
      on('disconnect', () => {
        console.log('disconnected!');
        //alert('disconnected!');
        this.ngAfterViewInit();
      });

    this.socket.
      on(this.rule.RuleID, (response) => {
        // This will happen when new run is triggered for this RuleID
        console.log('inside new run trigger');
        console.log("Rule Executed User "+response['LatestRun']['RuleExecutedByUser']);
        console.log("Auth State System Name1 "+this.authState.systemName);
        //console.log(" Latest Run 99 "+JSON.stringify(response['LatestRun']));
        //console.log("Response 100"+JSON.stringify(response));
        if (response && response['LatestRun'] && this.authState.systemName == response['LatestRun']['RuleExecutedByUser']) {
          console.log('inside first run');          
          this.rule.LatestRun = response['LatestRun'];
          this.id = this.rule.LatestRun.RuleRunID;  
          //this.id = this.rule.RuleRunID;  
          console.log("Rule Run ID 105 "+this.id);  
          this.registerForLatestRunStatus();
          this.onLatestRunChange();
        }
      });

    this.ruleState$
      .map(ruleState => ruleState.selectedRules
        .filter(rule => {
          return this.rule && rule && (rule['RuleID'] === this.rule.RuleID)
        }))
      .map(res => {
        return res[0];
      })
      .subscribe(response => {
        this.selected = response != null;
      });

  }

  registerForLatestRunStatus() {
    //console.log("Rule ID "+this.rule.RuleID + " LatestRun.RuleRunID:" + this.rule.LatestRun.RuleRunID + " Hello RunStatus=" + this.rule.LatestRun.RunStatus);
    if (this.rule.LatestRun.RunStatus == 'PENDING' || this.rule.LatestRun.RunStatus == 'RUNNING') {
      console.log('PENDING or RUNNING');
      //TODO: this seems to be commented on diff
      //this.runStatusTimer(); 
      console.log("Hello 33333");
      console.log("ID "+this.id);
      this.socket.on(this.id, (response) => {
        console.log("Hello 33334");
        // This will happen for latest run status change for this RunRuleID
        //console.log(response['RuleExecutedByUser']);
        console.log(this.rule.LatestRun.RuleExecutedByUser);
        console.log(this.authState.systemName);
        if (response && response['RunStatus'] && this.rule && this.rule.LatestRun && this.authState.systemName == response['RuleExecutedByUser']) {

          console.log('changing state for: ');
          console.log(this.authState.systemName);

          console.log('RunStatus: ');
          console.log(response['RunStatus']);

          this.rule.LatestRun.RunStatus = response['RunStatus'];
          this.onLatestRunChange();
        }
      });
    }

  }

  ngOnDestory() {
    this.socket.removeListener(this.rule.LatestRun.RuleRunID);
    this.socket.removeListener(this.rule.RuleID);
  }

  ngAfterViewChecked() {
    this.onLatestRunChange();
    this.cdRef.detectChanges();
  }

  onSelectTap() {
    if (this.canSelect) {
      this.selected = !this.selected;
      if (this.selected) {
        this.store.dispatch(new OnRuleSelectAction(this.rule));
      } else {
        this.store.dispatch(new OnRuleDeSelectAction(this.rule));
      }
    } else {
      this.presentToast(this.rule.LatestRun.RunStatus);
    }
  }

  onView() {
    this.modalCtrl.create("ManageRulePage", {
      rule: this.rule
    }, { cssClass: 'large-modal' }).present();
  }

  onLatestRunChange() {
    if (this.rule && this.rule.LatestRun && this.rule.LatestRun.RunStatus) {
      this.runHistoryIconColor = getRuleStatusColor(this.rule.LatestRun.RunStatus);
      switch (this.rule.LatestRun.RunStatus.toUpperCase()) {
        case "PENDING":
          this.canSelect = false;
          break;

        case "COMPLETED":
          this.canSelect = true;
          break;

        case "RUNNING":
          this.canSelect = false;
          break;

        case "FAILED":
          this.canSelect = true;
          break;

        default:
          this.canSelect = true;
          break;
      }
    }
  }

  presentToast(status: String) {
    let toast = this.toastCtrl.create({
      message: `Rule already ${status}`,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  runStatusTimer(){
    this.timerCount = 0;
    this.timerObj = setInterval(() => {     
      console.log("Timmer runId : ");    
      console.log(this.rule.RuleGroupID);
      this.getRuleStatus(this.rule.RuleGroupID);
      this.timerCount = this.timerCount + 1;
    }, 2*60*1000);
    console.log("Timmer Started!");
 }

 stopStatusTimer(){
  console.log("Destroy timmer!");
  if(this.timerObj){
    clearInterval(this.timerObj);
  }
}

getRuleStatus(ruleGroupID){
  console.log("Getting Rule details");
  console.log(ruleGroupID);
  //this.rulesService.get('{RuleGroupID: "'+this.rule.RuleGroupID+'"}').subscribe(data => {
 
  this.rulesService.get(ruleGroupID).subscribe( data => {
    console.log(data);
    if(data.results){
      for (let ruleObj of data.results){
        if(ruleObj.RuleID == this.rule.RuleID){
          var latestRunObj = JSON.parse( ruleObj.LatestRun);
          this.rule.LatestRun.RunStatus =latestRunObj.RunStatus;
          if(latestRunObj.RunStatus == "FAILED" || latestRunObj.RunStatus == "COMPLETED"){
            this.stopStatusTimer();
            break;
          }
        }
      }
    }
  });
  
}

ngOnDestroy() {
  //this.socket.removeListener(this.rule.LatestRun.RuleRunID);
  //this.socket.removeListener(this.rule.RuleID);
  //this.ngUnsubscribe.next();
  //this.ngUnsubscribe.complete();
}


}