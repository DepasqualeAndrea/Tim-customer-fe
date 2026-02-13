import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';

@Component({
    selector: 'app-navbar-pet-exclusive',
    templateUrl: './navbar-pet-exclusive.component.html',
    styleUrls: ['./navbar-pet-exclusive.component.scss'],
    standalone: false
})
export class NavbarPetExclusiveComponent implements OnInit {

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
  }

  get navbarLogo(): any {
    return ((this.dataService.tenantInfo || {}).navbar || {}).logo;
  }

}
