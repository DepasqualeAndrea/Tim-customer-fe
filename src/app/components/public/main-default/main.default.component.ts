import { Component } from '@angular/core';
import { GREAT_FLOOD } from 'app/core/models/token-interceptor.model';

@Component({
    selector: 'app-main-default',
    templateUrl: './main-default.component.html',
    standalone: false
})

export class MainDefaultComponent {

  constructor() {
    GREAT_FLOOD();
  }

}
