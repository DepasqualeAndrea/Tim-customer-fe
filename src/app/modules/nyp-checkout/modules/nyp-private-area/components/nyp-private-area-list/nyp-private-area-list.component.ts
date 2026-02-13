import { Component } from '@angular/core';
import { NypPolicy } from 'app/modules/nyp-checkout/models/api.model';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-nyp-private-area-list',
    templateUrl: './nyp-private-area-list.component.html',
    styleUrls: ['./nyp-private-area-list.component.scss'],
    standalone: false
})
export class NypPrivateAreaListComponent {
  public policies$: Observable<NypPolicy[]> = this.nypApiService.getPolicies();

  constructor(public nypApiService: NypApiService) { }
}
