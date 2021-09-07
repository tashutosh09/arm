import { Rule } from './../../models/rule.mdl';
import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { RulesService } from './rules.service';
import * as rules from './rules.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class RulesEffects {

  @Effect() get$ = this.actions$
    .ofType(rules.GET_RULE_ALL)
    .map(toPayload)
    .switchMap(payload => this.rulesService.get(payload.reportId)
      // If successful, dispatch success action with result
      .map(res => {
        if (res.status && res.results) {
          console.warn('inside rule effect');

          let rule = res.results.map(res => {
            return {
              ...res,
              LatestQuery: res.LatestQuery ? JSON.parse(res.LatestQuery) : null,
              LatestRun: res.LatestRun ? JSON.parse(res.LatestRun) : null,
            }
          });
          return ({ type: rules.GET_RULE_ALL_SUCCESS, payload: rule })
        } else {
          return ({ type: rules.GET_RULE_ALL_ERROR })
        }
      })
      // If request fails, dispatch failed action
      .catch(() => Observable.of({ type: rules.GET_RULE_ALL_ERROR }))
    );

  @Effect() getRuleParam$  = this.actions$
      .ofType(rules.GET_RULE_PARAMS)
      .map(toPayload)
      .switchMap(payload => this.rulesService.getRuleParams(payload))
      .map(res => {
        console.log("Rule Effect 08042021: "+JSON.stringify(res.results))
        if (res.status && res.results) {
          console.warn('inside rule effect of get rule parmas');

          let ruleParams = res.results;
          
          return ({ type: rules.GET_RULE_PARAMS_SUCCESS, payload: ruleParams })
        } else {
          return ({ type: rules.GET_RULE_PARAMS_ERROR })
        }
      })
      // If request fails, dispatch failed action
      .catch(() => Observable.of({ type: rules.GET_RULE_PARAMS_ERROR }));

  constructor(
    private rulesService: RulesService,
    private actions$: Actions
  ) {
    console.warn('inside constructor');
  }


}
