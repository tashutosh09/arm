import { PipesModule } from './../../pipes/pipes.module';
import { RuleRunHistoryModule } from './../../modules/RuleRunHistory/rule-run-history.module';
import { RulesModule } from './../../modules/rules/rules.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportPage } from './report';
import { ComponentsModule } from '../../components/components.module';
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
  declarations: [
    ReportPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportPage),
    ComponentsModule,
    RulesModule.forRoot(),
    RuleRunHistoryModule.forRoot(),
    PipesModule
  ],
})
export class ReportPageModule { }
