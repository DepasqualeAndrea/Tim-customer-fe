import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services';
import { UserTypes } from 'app/components/public/products-container/products-tim-employees/user-types.enum';

@Component({
    selector: 'app-logout',
    template: '',
    standalone: false
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    const user = this.auth.loggedUser
    if (user.data && user.data.user_type === UserTypes.RETIREE) {
      this.auth.logout('pensioner-access')
    } else {
      this.auth.logout()
    }
  }

}
