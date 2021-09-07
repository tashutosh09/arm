import { MetaDataModule } from './../../modules/MetaData/meta-data.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashPage } from './splash';

@NgModule({
  declarations: [
    SplashPage,
  ],
  imports: [
    IonicPageModule.forChild(SplashPage),
    MetaDataModule.forRoot()
  ],
})
export class SplashPageModule {}
