import { IonicPageModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { PiviotTableComponent } from './piviot-table.component';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [PiviotTableComponent],
    imports: [
        IonicPageModule.forChild(PiviotTableComponent),
        CommonModule],
    exports: [PiviotTableComponent]
})
export class PiviotTableModule {
    constructor() { }
}