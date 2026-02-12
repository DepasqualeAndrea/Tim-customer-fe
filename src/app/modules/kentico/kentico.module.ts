import {NgModule} from '@angular/core';
import {TranslateLoader, TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TranslateLoaderService} from './translate-layer/translate-loader.service';
import {KenticoTranslatePipe} from './data-layer/kentico-translate.pipe';
import {KenticoValuePipe} from './data-layer/kentico-value.pipe';
import { KenticoReplacePipe } from './data-layer/kentico-replace.pipe';

@NgModule({
  declarations: [
    KenticoTranslatePipe,
    KenticoValuePipe,
    KenticoReplacePipe
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLoaderService
      }
    }),
  ],
  exports: [
    KenticoTranslatePipe,
    KenticoValuePipe,
    KenticoReplacePipe
  ]
})
export class KenticoModule {

}

