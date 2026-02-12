import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@services';
import { CONSTANTS } from 'app/app.constants';

@Component({
  selector: 'app-not-confirmed-fca',
  templateUrl: './not-confirmed-fca.component.html',
  styleUrls: ['./not-confirmed-fca.component.scss']
})
export class NotConfirmedFcaComponent implements  OnInit, OnDestroy  {

  unexpectedError = false;

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
