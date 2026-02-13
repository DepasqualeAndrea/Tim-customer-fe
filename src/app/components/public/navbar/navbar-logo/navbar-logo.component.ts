import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';


@Component({
    selector: 'app-navbar-logo',
    templateUrl: './navbar-logo.component.html',
    styleUrls: ['./navbar-logo.component.scss'],
    standalone: false
})
export class NavbarLogoComponent implements OnInit {

  constructor(public dataService: DataService) {
  }

  ngOnInit(): void {
  }

  get navbarLogo(): any {
    return ((this.dataService.tenantInfo || {}).navbar || {}).logo;
  }
}
