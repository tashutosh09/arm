import { IOSocket } from './../../modules/IOSocket/io.socket.service';
import { AppStoreState } from './../../app/app.store.state';
import { Store } from '@ngrx/store';
import { CompanyName } from './../../models/company-name.mdl';
import { ToastController, ModalController } from 'ionic-angular';
import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { RuleRunHistory } from '../../models/ruleRunHistory';
import { RuleRunHistoryService } from '../../modules/RuleRunHistory/rule-run-history.module';
import { saveAs as importedSaveAs } from "file-saver";
import { getRuleStatusColor } from '../../helpers/ColorHelper';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/mergeMap';
import { Subject } from 'rxjs';
@Component({
  selector: 'rule-history-item',
  templateUrl: 'rule-history-item.html'
})
export class RuleHistoryItemComponent implements AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  @Input()
  item: RuleRunHistory;

  @Input()
  Rule: any;

  isDownloading: boolean = false;

  runStatusColor: string;

  companyName: string;

  companyIcon: string;

  companyIconColor: string;

  constructor(private ruleRunHistoryService: RuleRunHistoryService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private store: Store<AppStoreState>,
    private socket: IOSocket) {
  }


  ngAfterViewInit() {
    if (this.item != null) {
      this.runStatusColor = getRuleStatusColor(this.item.RunStatus);
      this.companyName = JSON.parse(this.item.RuleParam)['param.source.dbname'];
      this.store.select(state => state.CompanyNames)
        .map(res => res.result)
        .map(res => {
          return res.filter(res => (res.systemName == this.companyName))[0]
        })
        .subscribe(response => {

          if (response) {
            this.companyIcon = response.icon;
            this.companyIconColor = response.iconColor;
          }
        })
    }
    if (this.item.RunStatus == 'PENDING' || this.item.RunStatus == 'RUNNING') {
      this.socket.on(this.item.RuleRunID, (response) => {
        // This will happen for latest run status change for this RunRuleID
        if (response && response['RunStatus']) {
          this.item.RunStatus = response['RunStatus'];
          this.runStatusColor = getRuleStatusColor(this.item.RunStatus);
        }
      });
    }

  }

  ngOnDestroy() {
    //this.socket.removeListener(this.item.RuleRunID);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
}

  ngOnDestory() {
    this.socket.removeListener(this.item.RuleRunID);
  }

  downloadResults(runRuleID: string) {
    this.isDownloading = true;
    this.ruleRunHistoryService.downloadRuleResults(runRuleID)
      .subscribe(res => {
        if (res) {
          let datePipe = new DatePipe("en-US");
          importedSaveAs(res, `${this.Rule.RuleName}_${datePipe.transform(this.item.RuleRunStartTime, 'yyyy-MM-dd hh-mm-ss a')}.csv`);
        }
        this.isDownloading = false;
      }, error => {
        if (error.status == 412) {
          this.toastCtrl.create({
            message: "NO RESULTS FOUND",
            duration: 3000,
            dismissOnPageChange: true
          }).present();
        }
        if (error.status == 500) {
          this.toastCtrl.create({
            message: "Server error",
            duration: 3000,
            dismissOnPageChange: true
          }).present();
        }
        this.isDownloading = false;
      });
  }

  showDetails(item) {
    let self = this;
    let runHistoryDetails = this.modalCtrl.create("TablePage", { historyItem: this.item, rule: this.Rule }, { cssClass: 'large-modal' });
    runHistoryDetails.onDidDismiss(data => {
      if (data && data.download) {
        self.downloadResults(self.item.RuleRunID);
      }
    })
    runHistoryDetails.present();
  }

}
