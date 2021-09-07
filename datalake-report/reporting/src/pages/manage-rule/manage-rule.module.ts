import { RuleQueryModule } from './../../modules/RuleQuery/rule-query.module';
import { RulesModule } from './../../modules/rules/rules.module';
import { CodemirrorModule } from 'ng2-codemirror';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageRulePage } from './manage-rule';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    ManageRulePage,
  ],
  imports: [
    IonicPageModule.forChild(ManageRulePage),
    CodemirrorModule,
    RulesModule.forRoot(),
    RuleQueryModule.forRoot(),
    ClipboardModule
  ]
})
export class ManageRulePageModule { }
