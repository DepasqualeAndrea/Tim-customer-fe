import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {ComponentFeaturesService} from './componentFeatures.service';

@Injectable({
  providedIn: 'root'
})

export class GoogleAutocompleteAddressService {

  private browserGlobals = {
    documentRef(): any {
      return document;
    }
  };

  constructor() {
  }

  public init() {
    const GooAPICode = 'AIzaSyB1lwu1uoufSet1HvGYZctWFFvlBfyaiEo';

    if (!GooAPICode) {
      return;
    }

    const doc = this.browserGlobals.documentRef();

    const googleAutocompleteScript = doc.createElement('script');
    googleAutocompleteScript.id = 'googleAutocompleteScript';
    googleAutocompleteScript.async = true;
    googleAutocompleteScript.defer = true;
    googleAutocompleteScript.src = 'https://maps.googleapis.com/maps/api/js?key=' + GooAPICode + '&libraries=places&v=weekly';
    doc.body.insertAfter(googleAutocompleteScript, doc.body.lastChild);
  }
}
