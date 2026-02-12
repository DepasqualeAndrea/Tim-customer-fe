import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DataService, Tenants} from '@services';
import {Router} from '@angular/router';

/**
 * This component only exists for correctly redirecting onto right page from INSIDE angular.
 * This page is ever reached from outside (proxy, at this specific time while i'm writing, redirects /privati path onto 1.3)
 * When trying to reach from inside /privati when host is migration platform (any environment), a "redirect" to proxy will be called, proxy will redirect onto 1.3.
 * anyway, if the host IS NOT yolo (IT), this page produce an internal (angular level) redirect to /prodotti.
 */

@Component({
  selector: 'app-privati',
  template: '',
})
export class PrivatiComponent implements OnInit {
  private host: string;
  private targetHost: RegExp = /^(.*?[:][/]{2})*((integration|demo|www)[.])*yolo-insurance[.]com.*$/;

  constructor(private location: Location, private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.host = window.location.href.replace(this.location.path(), '');

    if (!this.shouldRedirect()) {
      this.router.navigate(['prodotti']);
      return;
    }

    const url = this.host + '/privati';
    window.location.href = url;
  }

  private shouldRedirect(): boolean {
    return this.targetHost.test(this.host);
  }

}
