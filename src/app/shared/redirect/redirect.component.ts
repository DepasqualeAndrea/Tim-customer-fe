import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-redirect',
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.scss'],
    standalone: false
})
export class RedirectComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    const redirectLocationUrl = this.route.snapshot.queryParams.page;
    this.document.location.href = redirectLocationUrl;
  }

}
