import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { RuleQuery } from '../../models/ruleQuery';

@Component({
  selector: 'rule-query',
  templateUrl: 'rule-query.html'
})
export class RuleQueryComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();

  @Input()
  ruleQuery: RuleQuery;

  @Input()
  viewMode: 'full' | 'teaser';


  constructor() {
  }


  toggleViewMode() {
    if (this.viewMode == 'full') {
      this.viewMode = 'teaser';
    } else {
      this.viewMode = 'full';
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
