import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { PolicyRedirectComponent } from './policy-redirect/policy-redirect.component';

@Component({
  selector: 'app-policy-detail',
  templateUrl: './policy-detail.component.html',
  styleUrls: ['./policy-detail.component.scss']
})
export class PolicyDetailComponent implements OnInit {

  useBasicComponents: boolean;
  url = location.href;
  @ViewChild('policyRedirect', { static: true }) loading: PolicyRedirectComponent;

  constructor(
    private componentFeaturesService: ComponentFeaturesService,
    public  dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.componentFeaturesService.useComponent('private-area');
    this.componentFeaturesService.useRule('basic-components');
    this.useBasicComponents = this.componentFeaturesService.isRuleEnabled();
  }

  handleRequestLoader(value: boolean) {
    if (value) {
      this.loading.show();
    } else {
      this.loading.hide();
    }
  }

}
