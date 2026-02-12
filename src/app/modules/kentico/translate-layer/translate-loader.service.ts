import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { KenticoItemStateRegister } from '../data-layer/kentico-item-state-register.service';
import { KenticoItemState } from '../data-layer/kentico-item-state.enum';

@Injectable({
  providedIn: 'root'
})
export class TranslateLoaderService implements TranslateLoader {

  constructor(
    private itemStateRegister: KenticoItemStateRegister
  ) {
  }

  getTranslation(lang: string): Observable<any> {
    return from(fetch('assets/i18n/it.json').then(r => r.json())).pipe(
      tap(translations => {
        Object.entries(translations).map<string>(entry => entry[0]).forEach(translatationName => {
          this.itemStateRegister.setState(translatationName, KenticoItemState.Cached);
        })
      })
    );
  }


}
