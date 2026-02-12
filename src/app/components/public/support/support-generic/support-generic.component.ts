import { Component, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { KenticoNetInsuranceService } from 'app/core/services/kentico/kentico-net-insurance.service';
import { Image } from 'app/modules/kentico/models/image.model';
import { map } from 'rxjs/operators';
import { ElementModels } from 'kentico-cloud-delivery';
import { InsurancesService } from '@services';
import { Product } from '@model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-support-generic',
  templateUrl: './support-generic.component.html',
  styleUrls: ['./support-generic.component.scss']
})
export class SupportGenericComponent implements OnInit, OnDestroy {
  faqImage: ElementModels.AssetModel;
  products: Product[];
  infoLink: string;

  constructor(private kenticoService: KenticoNetInsuranceService,
    private nypInsuranceService: NypInsurancesService,
    private componentFeatures: ComponentFeaturesService) {
  }

  ngOnInit() {
    this.kenticoService.getItem<Image>('faq_image').pipe(untilDestroyed(this), map((image) => image.image.value[0])).subscribe(image => {
      this.faqImage = image;
    });

    this.nypInsuranceService.getProducts().subscribe(list => {
      this.products = list.products;
    });
    this.componentFeatures.useComponent('support-generic');
    this.componentFeatures.useRule('info-privacy');
    this.infoLink = this.componentFeatures.getConstraints().get('url');
  }
  ngOnDestroy() {
  }
}


