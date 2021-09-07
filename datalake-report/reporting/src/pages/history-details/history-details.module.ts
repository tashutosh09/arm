import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryDetailsPage } from './history-details';

@NgModule({
  declarations: [
    HistoryDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryDetailsPage),
    ComponentsModule
  ],
})
export class HistoryDetailsPageModule { }
