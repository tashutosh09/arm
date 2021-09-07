import { ComponentsModule } from './../../components/components.module';
import { PiviotTableModule } from './../../components/piviot-table/piviot-table.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TablePage } from './table-page';

@NgModule({
  declarations: [
    TablePage,
  ],
  imports: [
    IonicPageModule.forChild(TablePage),
    PiviotTableModule,
    ComponentsModule
  ],
})
export class PiviotPageModule { }
