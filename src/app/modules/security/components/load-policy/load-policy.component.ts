import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DataService } from '@services';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sunny-component',
  template: ''
})
export class LoadPolicyComponent implements OnInit, OnDestroy {
  userDetailsLoaded = false;
  url = location.href;

  constructor(
    private auth: AuthService,
    private router: Router,
    public  dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const policyID = this.getPolicyId(this.activatedRoute);
    const redirectUrl = '/private-area/policy/' + policyID;
    if (!this.auth.loggedIn) {
      localStorage.setItem('canOpenClaim', 'true');
      this.loginService.setupRedirectAfterLogin(redirectUrl);
      this.router.navigate(['/login']);
    } else {
      localStorage.setItem('canOpenClaim', 'true');
      this.router.navigate([redirectUrl]);
    }

  }

  private getPolicyId(route: ActivatedRoute) {
    const id = route.snapshot.queryParams['id'];
    if (id) {
      try {
        return id;
      } catch (error) {
        return id;
      }
    }
  }

  ngOnDestroy() {}

}
