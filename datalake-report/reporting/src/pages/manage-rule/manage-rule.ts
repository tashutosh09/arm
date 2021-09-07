import { RuleQueryService } from './../../modules/RuleQuery/rule-query.service';
import { RulesService } from './../../modules/rules/rules.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import 'codemirror/mode/sql/sql'
import { RuleQuery } from '../../models/ruleQuery';
import { logMessage } from '../../helpers/LogHelper';

@IonicPage()
@Component({
  selector: 'page-manage-rule',
  templateUrl: 'manage-rule.html',
})
export class ManageRulePage {
  newQuery = "";
  ruleQueries: RuleQuery[];

  expandedQueryID: string;

  readOnlyView: boolean = true;

  codeEditorBaseConfig = {
    mode: 'text/x-hive',
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    matchBrackets: true,
    autofocus: true,
    theme: 'ambiance',
  };

  codeEditorReadOnlyConfig = Object.assign({ readOnly: true }, this.codeEditorBaseConfig);
  codeEditorEditableConfig = Object.assign({ readOnly: false }, this.codeEditorBaseConfig);

  rule: any = {

  };

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams,
    private ruleService: RulesService,
    private ruleQueryService: RuleQueryService) {
    this.rule = navParams.get('rule');
    if (!this.rule.RuleID) {
      this.readOnlyView = false;
    }
  }

  ionViewDidLoad() {
    logMessage('ionViewDidLoad ManageRulePage');
    this.ruleQueryService.getAll(this.rule.RuleID)
      .map(res => res.json().results)
      .subscribe(response => {
        this.ruleQueries = response;
        logMessage(response);
      })
  }

  save() {
    this.ruleService.addUpdateRule(this.rule)
      .map(res => res.json())
      .subscribe(response => {
        if (response.status) {
          this.close();
        } else {
          logMessage("error");
        }
      });
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
