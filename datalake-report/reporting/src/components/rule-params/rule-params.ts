import { Store } from '@ngrx/store';
import { AppStoreState } from './../../app/app.store.state';
import { CompanyName } from './../../models/company-name.mdl';
import { Feed } from '../../models/feed.mdl';
import { IMyDate, IMyDpOptions } from 'mydatepicker';
import { RuleGroup } from './../../models/ruleGroup.mdl';
import { Component, Input, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { toFormatedDateTime } from '../../common_code/CommonHelper';
import { GetFeedsAction } from '../../modules/Feeds/feed.actions';
import { Subject } from 'rxjs';

/**
 * Can handle following
  {
    key: string,
    title: string,
    dataType: text|timestamp|select,
    defaultValue?: text(In case of select menu pass value from options key-value pair),
    options?: [
      {
        key: string,
        value: string|number
      }
    ]
  }
 */

@Component({
  selector: 'rule-params',
  templateUrl: 'rule-params.html'
})
export class RuleParamsComponent implements AfterViewInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  
    selectedArray :any = []; //Add Subrata 13042021

  @Input()
  ruleGroupParams: any;

  private reducedParams: {} = {
    'param.source.dbname': null,
  }

  private companyNames: CompanyName[];
  private feeds: Feed[] = [];

  private todayDate: Date = new Date();
  today: IMyDate = {
    year: this.todayDate.getFullYear(),
    month: this.todayDate.getMonth() + 1,
    day: this.todayDate.getDate()
  }

  private dateOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
  };


  constructor(private cdr: ChangeDetectorRef, private store: Store<AppStoreState>) {
    this.store.select(state => state.CompanyNames)
      .map(res => res.result).subscribe(companies => {
        this.companyNames = companies; //Subrata
        /*this.companyNames = [{
          
          id: "7145f363-9072-4c02-8bb6-869093e6d2ff",
          systemName: "acme",
          name: "acme",
          icon: "null",
          iconColor: "null",
          feeds: []
        }];*/
      });

    this.store.select(state => state.Feed)
      .map(res =>res.result).subscribe(feeds => {
        this.feeds = feeds;
      });
  }

  ngAfterViewInit() {
    console.log("Rule Group Params: "+this.ruleGroupParams);
    for (let param of this.ruleGroupParams) {
      console.log("===param==="+param);
      console.log(param['key']+"====="+param['dataType']+"==="+param['title']);
      this.reducedParams[param.key] = param['defaultValue'] || null;
      this.cdr.detectChanges();
    }
  }

  public validateParams(): boolean {
    console.log("Rule Group Params: "+JSON.stringify(this.ruleGroupParams));
    console.log("==Reduced Param1==="+JSON.stringify(this.reducedParams));
    for (var key in this.reducedParams) {
      console.log("===Key1==="+key);
      if (this.reducedParams.hasOwnProperty(key)) {
        console.log("===Key2==="+key);
        if (this.reducedParams[key] == null) {
          console.log("===Key3==="+key);
          return false;
        }
      }
    }
    return true;
  }


  private toDate(date: IMyDate): String {
    return `${date.year}-${date.month}-${date.day}`;
  }

  public getParams() {
    //Chinmay
    /*
    //tmpRuleGroupParams: any;
    for (let param of this.ruleGroupParams) {
      if(param.dataType =='table'){
        
      }
      if(param.dataType =='timestamp'){
        
      }
      this.cdr.detectChanges();
    }

    for (var key in this.reducedParams) {
      if (this.reducedParams.hasOwnProperty(key)) {
        if (this.reducedParams[key].date != null) {
          this.reducedParams[key] = toFormatedDateTime(this.toDate(this.reducedParams[key].date));
        }
      }
    }
*/
    //======================
    //console.log("====reducedParams======");
    console.log('====reducedParams======'+JSON.stringify(this.reducedParams));
    for (var key in this.reducedParams) {
      if (this.reducedParams.hasOwnProperty(key)) {
        if (this.reducedParams[key].date != null) {
          this.reducedParams[key] = toFormatedDateTime(this.toDate(this.reducedParams[key].date));
        }
      }
    }
    return this.reducedParams;
  }

  public getFeeds(company: string) {
    //console.log("==getFeeds=="+company);
    this.store.dispatch(new GetFeedsAction(company));  
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

//Start Subrata 13042021
  selectMember(data, paramKey){
    var dataStr = '';
    console.log(JSON.stringify(data));
    console.log(JSON.stringify(paramKey));
    if (data.checked == true) {
      this.selectedArray.push(data);
    } else {
      let newArray = this.selectedArray.filter(function(el) {
        return el.value !== data.value;
      });
      this.selectedArray = newArray;
    }
    console.log('Selected Array: '+JSON.stringify(this.selectedArray));
    for(var ndx=0;ndx<this.selectedArray.length;ndx++){
      dataStr += this.selectedArray[ndx].value+','
    }
    dataStr = dataStr.slice(0, -1);
    this.reducedParams[paramKey] = dataStr;
  }
//End Subrata 13042021
}
