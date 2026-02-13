import {Component, OnInit, AfterViewChecked} from '@angular/core';
import {AuthService, DataService} from '@services';
import {AppComponent} from '../../../app.component';
import {environment} from '../../../../environments/environment';
import {SharingDataService} from '../../../core/services/sharing-data.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ComponentFeaturesService} from 'app/core/services/componentFeatures.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent implements OnInit {

  footerHidden: boolean;

  constructor(
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.hideFooter();
  }

  private hideFooter(): void {
    this.componentFeaturesService.useComponent('mobile-products-page');
    this.componentFeaturesService.useRule('hide-footer');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.dataService.isSplash = true;
    }
    this.footerHidden = this.route.snapshot.queryParams.embedded === 'true';
  }

}
