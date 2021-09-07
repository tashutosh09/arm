import { MomentStandardPipe } from './moment/moment.standard';
import { NgModule } from '@angular/core';
import { MomentPipe } from './moment/moment';
@NgModule({
	declarations: [MomentPipe, MomentStandardPipe],
	imports: [],
	exports: [MomentPipe, MomentStandardPipe]
})
export class PipesModule { }
