import { Component, OnInit } from '@angular/core';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { CONSTANTS } from 'app/app.constants';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { DataService } from '@services';

@Component({
    selector: 'app-policy-detail-recap-basic-sereneta',
    templateUrl: './policy-detail-recap-basic-sereneta.component.html',
    styleUrls: ['./policy-detail-recap-basic-sereneta.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicSerenetaComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  duration: string;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService
  ) {
    super();
  }

  ngOnInit() {
    this.setDuration();
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  setDuration() {
      this.kenticoTranslateService.getItem<any>('private_area.yearly_duration_type').pipe().subscribe(item => {
        this.duration = item.value;
      });
  }

}
