import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CONFIG_UI } from '../../app/app.config';
import { MsalService } from '../../app/msal.service';

@Injectable()
export class RulesService {
  v1 : any ;

  constructor(private http: HttpClient, private msalService: MsalService) { }

  get(RuleSubGroupID: string): Observable<any> {
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}rule/get`, {
      UserName: this.msalService.userProfile().idToken.preferred_username,
      RuleSubGroupID: RuleSubGroupID
    });
  }

  addUpdateRule(ruleModel: any): Observable<any> {
    console.log("In Rule Service addUpdateRule "+ruleModel.id);
    return this.http.post(`${CONFIG_UI.API.METASTORE_BASE_PATH}rules/${ruleModel.id ? 'update' : 'add'}`, ruleModel);
  }

  getRuleParams(ruleList: Array<string>): Observable<any> {
    return this.http.get(`${CONFIG_UI.API.METASTORE_BASE_PATH}rule/params?RuleIdList=${encodeURIComponent( JSON.stringify(ruleList))}`);
  }
}
