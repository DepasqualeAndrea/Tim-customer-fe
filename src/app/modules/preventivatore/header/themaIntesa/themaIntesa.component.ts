import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from '@services';

@Component({
    selector: 'app-header-thema-intesa',
    templateUrl: './themaIntesa.component.html',
    styleUrls: ['../../preventivatoreY.component.scss', './themaIntesa.component.scss'],
    standalone: false
})
export class HeaderThemaIntesa implements OnInit {

  @Input() product;
  displayedUsername: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if(this.authService.currentUser.firstname) {
      this.displayedUsername = " " + this.authService.currentUser.firstname;
    } else {
      this.displayedUsername = "";
    }
  }

}
