import { HttpClient } from '@angular/common/http';
import { RuleRunHistory } from './../../models/ruleRunHistory';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import { CONFIG_UI } from '../../app/app.config';
import { MsalService } from '../../app/msal.service'


@Injectable()
export class RuleRunHistoryService {
  v1 : any ;

  constructor(private http: HttpClient, private msalService: MsalService) { }

  get(ruleID: string, queryID?: string, offset: number = 0, limit: number = 5): Observable<any> {
    let body = {
      UserName: this.msalService.userProfile().idToken.preferred_username,
      RuleID: ruleID,
      Limit: limit,
      Offset: offset
    };

    if (queryID) {
      body['QueryID'] = queryID;
    }
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}rulerunhistory/get`, body);
  }

  count(ruleID: string, queryID?: string): Observable<any> {
    let body = {
      UserName: this.msalService.userProfile().idToken.preferred_username,
      RuleID: ruleID
    };

    if (queryID) {
      body['QueryID'] = queryID;
    }
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}rulerunhistory/count`, body);
  }


  add(rules: RuleRunHistory[]): Observable<any> {
    let uuid = UUID.UUID();
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}rulerunhistory/add`, {
      rulesToRun: rules
    });
  }

  downloadRuleResults(ruleRunID: string) {
    return this.http.get(`${CONFIG_UI.API.METASTORE_BASE_PATH}runresults/1/get?RuleRunID=${ruleRunID}`, { responseType: 'blob' });
  }
}
