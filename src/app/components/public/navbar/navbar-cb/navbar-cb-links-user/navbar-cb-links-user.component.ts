import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar-cb-links-user',
  templateUrl: './navbar-cb-links-user.component.html',
  styleUrls: ['./navbar-cb-links-user.component.scss']
})
export class NavbarCbLinksUserComponent implements OnInit {

  @Input('userInfo') userInfo;

  constructor() { }

  ngOnInit() {
  }


}
