import { Component, OnInit } from '@angular/core';
import { SSOCseService } from 'app/core/services/sso/sso-cse.service';
import { JwtHelperService } from '@services';

@Component({
  selector: 'app-jwt-code',
  templateUrl: './jwt-code.component.html',
  styleUrls: ['./jwt-code.component.scss']
})
export class JwtCodeComponent implements OnInit {

  jwtCode = '';

  constructor(private sso: SSOCseService, private jwtHelper: JwtHelperService) { }

  ngOnInit() {
    this.jwtCode = JSON.stringify(this.jwtHelper.decodeToken(this.sso.dataStack.get()));
  }
}
