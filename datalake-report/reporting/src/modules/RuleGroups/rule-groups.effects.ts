import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { RuleGroupsService } from './rule-groups.service';
import * as ruleGroups from './rule-groups.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class RuleGroupsEffects {

  @Effect() get$ = this.actions$
    .ofType(ruleGroups.GET_ALL_RULE_GROUPS)
    .switchMap(payload => this.ruleGroupsService.get()
      .map(res => {
        if (res.status && res.results) {
          return ({ type: ruleGroups.GET_ALL_RULE_GROUPS_SUCCESS, payload: res.results })
        } else {
          return ({ type: ruleGroups.GET_ALL_RULE_GROUPS_ERROR })
        }
      })
      .catch(() => Observable.of({ type: ruleGroups.GET_ALL_RULE_GROUPS_ERROR }))
    );

  constructor(
    private ruleGroupsService: RuleGroupsService,
    private actions$: Actions
  ) { }

}
