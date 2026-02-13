import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONSTANTS } from 'app/app.constants';
import { DataService } from '@services';

@Component({
    selector: 'app-not-confirmed-intesa',
    templateUrl: './not-confirmed-intesa.component.html',
    styleUrls: ['./not-confirmed-intesa.component.scss'],
    standalone: false
})
export class NotConfirmedIntesaComponent implements OnInit, OnDestroy {

  unexpectedError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.isSplash = true;
    this.unexpectedError = this.route.snapshot.queryParamMap.has(CONSTANTS.SSO_UNEXPECTED_ERROR_PARAM);
  }

  ngOnDestroy() {
    this.dataService.isSplash = false;
  }

  backToLandingPage() {
    this.router.navigate(['/landing-page']);
  }

}
