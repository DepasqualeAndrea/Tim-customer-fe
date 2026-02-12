import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {DataService} from './data.service';

@Injectable()
export class RouterService {
  checkout_steps = [];

  public previousUrl: string
  public currentUrl: string

  /**
   * Matches any url that starts with any alphanumeric character followed by a dot and then has at least one more alphanumeric character.
   * Supports optional schema (http://, https://, etc.) and optional www.
   * Examples:
   *    - http://www.site.it/some/path    OK
   *    - https://www.site.it/path        OK
   *    - www.site.it/                    OK
   *    - site.it                         OK
   *    - http://site.it/                 OK
   *    - /some/relative/path             NO
   */
  private tester: RegExp = /^(\w*:\/\/)?(www\.)?\w+\.\w+/;

  constructor(private router: Router,
              private dataService: DataService) {
    this.setupNavigationHistory()
  }

  setupNavigationHistory() {
    this.currentUrl = this.router.url
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl
        this.currentUrl = event.url
      }
    })
  }

  navigateBaseUrl(): void {
    const queryParams = this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extractedUrl.queryParams : {};
    let baseUrl = this.dataService.tenantInfo.baseUrl;
    let countParams = 0;
    for (const [key, value] of Object.entries(queryParams)) {
      if (key && value) {
        baseUrl += countParams === 0 ? '?' : '&';
        baseUrl += key + '=' + value;
      }
      countParams++;
    }

    this.navigate(baseUrl);
  }

  navigate(url: string) {
    if (this.tester.test(url)) {
      // is external
      window.location.href = url;
    } else {
      this.router.navigateByUrl(url);
    }
  }
}
