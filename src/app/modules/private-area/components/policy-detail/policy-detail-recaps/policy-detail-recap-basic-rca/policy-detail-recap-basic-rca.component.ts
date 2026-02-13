import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { CONSTANTS } from 'app/app.constants';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
    selector: 'app-policy-detail-recap-basic-rca',
    templateUrl: './policy-detail-recap-basic-rca.component.html',
    styleUrls: ['./policy-detail-recap-basic-rca.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicRcaComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  duration: string;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) {
    super();
  }

  ngOnInit() {
    this.setDuration();
  }

  setDuration() {
    this.kenticoTranslateService.getItem<any>('private_area.yearly_duration_type').pipe().subscribe(item => {
      this.duration = item.value;
    });
  }

}
