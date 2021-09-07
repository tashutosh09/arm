import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { RuleRunHistory } from '../../models/ruleRunHistory';
import { RuleRunHistoryService } from '../../modules/RuleRunHistory/rule-run-history.module';
import { Subject } from 'rxjs';

@Component({
  selector: 'rule-history',
  templateUrl: 'rule-history.html'
})
export class RuleHistoryComponent implements AfterViewInit, OnDestroy {
//export class RuleHistoryComponent{
  private ngUnsubscribe = new Subject();
  @Input()
  ruleID: string;

  @Input()
  Rule: any;

  ruleHistory: RuleRunHistory[] = new Array<any>();

  count: number = 0;

  currentOffset: number = 0;

  maxOffset: number = 0;

  itemsPerPage: number = 5;

  loading: boolean = false;


  constructor(private ruleRunHistoryService: RuleRunHistoryService) {
  }

  ngAfterViewInit() {
    this.loading = true;
    this.ruleRunHistoryService.count(this.ruleID)
      .map(res => res.results[0].total)
      .subscribe(count => {
        console.log("In Rule History call count");
        this.count = count;
        this.loading = false;
        if (this.count > 0) {
          this.maxOffset = ((Math.ceil(this.count / this.itemsPerPage) * this.itemsPerPage) - this.itemsPerPage);
          this.getHistory(this.currentOffset);
        }
      });
  }

  getHistory(offset: number) {

    this.loading = true;
    this.ruleRunHistoryService.get(this.ruleID, null, offset, this.itemsPerPage)
      .subscribe(response => {
        console.log("In Rule-History ts call get");
        if (response && response.status && response.results && response.results.length > 0) {
          this.ruleHistory = response.results;
          this.loading = false;
          this.currentOffset = offset;
        }else{
          this.loading = false; // April2019
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
