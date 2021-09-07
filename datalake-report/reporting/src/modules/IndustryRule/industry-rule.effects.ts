import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { IndustryRuleService } from './industry-rule.service';
import * as industryRules from './industry-rule.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class IndustryRuleEffects {

  @Effect() get$ = this.actions$
    .ofType(industryRules.GET_ALL_INDUSTRY_RULE)
    .map(toPayload)
    .switchMap(payload => this.industryRuleService.get(payload.rulegroupid)
      .map(res => {
        if (res.status && res.results) {
          console.log("Subrata 20");
          return ({ type: industryRules.GET_ALL_INDUSTRY_RULE_SUCCESS, payload: res.results })
        } else {
          console.log("Subrata 21");
          return ({ type: industryRules.GET_ALL_INDUSTRY_RULE_ERROR })
        }
      })
      .catch(() => Observable.of({ type: industryRules.GET_ALL_INDUSTRY_RULE_ERROR }))
    );

  constructor(
    private industryRuleService: IndustryRuleService,
    private actions$: Actions
  ) { }

}
