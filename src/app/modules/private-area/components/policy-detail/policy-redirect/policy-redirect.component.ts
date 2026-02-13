import { Component, OnInit } from '@angular/core';
import {BlockUIService} from 'ng-block-ui';

@Component({
    selector: 'app-policy-redirect',
    template: '',
    standalone: false
})
export class PolicyRedirectComponent implements OnInit {

  private redirectText: string = 'Loading...';
  private uiTarget: string = 'block-ui-main';

  constructor(
    private blockUIService: BlockUIService
  ) { }

  ngOnInit() {
  }

  show() {
    document.body.style.overflow = 'hidden';
    this.blockUIService.start(this.uiTarget, this.redirectText);
  }

  hide() {
    document.body.style.overflow = 'auto';
    this.blockUIService.stop(this.uiTarget);
  }

}
