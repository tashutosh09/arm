import { RuleRunHistory } from './../../models/ruleRunHistory';
import { Component, Input, OnDestroy } from '@angular/core';
import { getRuleStatusColor } from '../../helpers/ColorHelper';
import { Subject } from 'rxjs';


@Component({
  selector: 'rule-history-details',
  templateUrl: 'rule-history-details.html'
})
export class RuleHistoryDetailsComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();

  @Input()
  private ruleRunHistory: RuleRunHistory;

  runStatusColor: string;

  private ruleParams: {
    key: string,
    value: any
  }[] = [];

  constructor() {
  }

  ngOnInit() {
    let ruleParamObject = JSON.parse(this.ruleRunHistory.RuleParam);
    this.runStatusColor = getRuleStatusColor(this.ruleRunHistory.RunStatus);
    for (var key in ruleParamObject) {
      if (ruleParamObject.hasOwnProperty(key)) {
        this.ruleParams.push({
          key: key,
          value: ruleParamObject[key]
        })
      }
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
