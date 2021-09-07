import { CONFIG_UI } from '../../app/app.config';
import { RuleRunHistoryService } from './../../modules/RuleRunHistory/rule-run-history.service';
import { RuleRunHistory } from './../../models/ruleRunHistory';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-table',
  templateUrl: 'table-page.html',
})
export class TablePage {
  private ruleRunHistory: RuleRunHistory;
  private rule: string;
  selectedView = 'details';
  runRuleResults: any;
  isDownloading: boolean;
  configUI = CONFIG_UI;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private ruleRunHistoryService: RuleRunHistoryService) {
    this.ruleRunHistory = this.navParams.get('historyItem');
    this.rule = this.navParams.get('rule');
    if (this.ruleRunHistory.RunResultRowCount != 'null' && this.ruleRunHistory.RunResultRowCount != '0') {
      this.fetchResults(this.ruleRunHistory.RuleRunID);
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  downloadResults() {
    this.viewCtrl.dismiss({ download: true });
  }

  fetchResults(runRuleID: string) {
    this.isDownloading = true;
    this.ruleRunHistoryService.downloadRuleResults(runRuleID)
      .subscribe(res => {
        if (res) {
          this.runRuleResults = res;
          this.isDownloading = false;
        }
      }, error => {
        this.isDownloading = false;
      });
  }

}
