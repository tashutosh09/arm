import { InterceptorModule } from './../Network/InterceptorModule';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FeedService } from './feed.service';
import { feedReducer } from './feed.reducer';
import { FeedEffects } from './feed.effects';

@NgModule({
    imports: [
      InterceptorModule,
      StoreModule.forFeature("Feed", feedReducer),
      EffectsModule.forFeature([FeedEffects])
    ],
    exports: [],
    declarations: []
  })
export class FeedModule {
    static forRoot() : ModuleWithProviders {
        return {
            ngModule: FeedModule,
            providers: [FeedService]
        };
    }
}

export { FeedService } from './feed.service';
export * from './feed.actions';
export { FeedState } from './feed.state';