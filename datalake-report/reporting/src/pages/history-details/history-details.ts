import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RuleRunHistory } from '../../models/ruleRunHistory';

@IonicPage()
@Component({
  selector: 'page-history-details',
  templateUrl: 'history-details.html',
})
export class HistoryDetailsPage {
  private item: RuleRunHistory;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.item = this.navParams.get('historyItem');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  downloadResults() {
    this.viewCtrl.dismiss({ download: true });
  }

}
