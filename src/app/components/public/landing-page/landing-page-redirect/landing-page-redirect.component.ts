import { Component, OnInit } from '@angular/core';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';

@Component({
  selector: 'app-landing-page-redirect',
  templateUrl: './landing-page-redirect.component.html',
  styleUrls: ['./landing-page-redirect.component.scss']
})
export class LandingPageRedirectComponent implements OnInit {

  constructor(private componentFeaturesService: ComponentFeaturesService) { }

  ngOnInit() {
    this.componentFeaturesService.useComponent('landing-page-redirect');
    this.componentFeaturesService.useRule('external-link-not-logged');
    window.location.href = this.componentFeaturesService.getConstraints().get('link');
  }

}
