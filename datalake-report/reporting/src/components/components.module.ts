import { PipesModule } from './../pipes/pipes.module';
import { MyDatePickerModule } from 'mydatepicker';
import { NgModule } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu';
import { RuleComponent } from './rule/rule';
import { IonicPageModule } from 'ionic-angular/module';
import { RuleGroupsModule } from '../modules/RuleGroups/rule-groups.module';
import { RuleQueryComponent } from './rule-query/rule-query';
import { RuleHistoryComponent } from './rule-history/rule-history';
import { ClipboardModule } from 'ngx-clipboard';
import { RuleRunHistoryModule } from '../modules/RuleRunHistory/rule-run-history.module';
import { RuleHistoryItemComponent } from './rule-history-item/rule-history-item';
import { RuleParamsComponent } from './rule-params/rule-params';
import { AccordionModule } from "ngx-accordion";
import { NgSvgIconModule } from 'ng-svg-icon';
import { RuleHistoryDetailsComponent } from './rule-history-details/rule-history-details';
import { DatatableComponent } from './datatable/datatable';

@NgModule({
	declarations: [
		SideMenuComponent,
		RuleComponent,
		RuleQueryComponent,
		RuleHistoryComponent,
		RuleHistoryItemComponent,
		RuleParamsComponent,
		RuleHistoryDetailsComponent,
		DatatableComponent],
	imports: [
		IonicPageModule.forChild(SideMenuComponent),
		IonicPageModule.forChild(RuleComponent),
		IonicPageModule.forChild(RuleParamsComponent),
		IonicPageModule.forChild(DatatableComponent),
		RuleGroupsModule.forRoot(),
		ClipboardModule,
		RuleRunHistoryModule.forRoot(),
		MyDatePickerModule,
		PipesModule,
		AccordionModule,
		NgSvgIconModule.forRoot({})
	],
	exports: [SideMenuComponent,
		RuleComponent,
		RuleQueryComponent,
		RuleHistoryComponent,
		RuleHistoryItemComponent,
		RuleParamsComponent,
		RuleHistoryDetailsComponent,
		DatatableComponent],
})
export class ComponentsModule { }
