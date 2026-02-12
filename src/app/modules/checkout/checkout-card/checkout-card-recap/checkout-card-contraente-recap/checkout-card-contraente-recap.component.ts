import { DataService } from '@services';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CheckoutContractor } from 'app/modules/checkout/checkout-step/checkout-step-address/checkout-step-address.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import { CheckoutProduct } from 'app/modules/checkout/checkout.model';


@Component({
  selector: 'app-checkout-card-contraente-recap',
  templateUrl: './checkout-card-contraente-recap.component.html',
  styleUrls: ['./checkout-card-contraente-recap.component.scss']
})
export class CheckoutCardContraenteRecapComponent implements OnInit {


  @Input() contractor: CheckoutContractor;
  @Input() product: CheckoutProduct;
  @Output() editStepButton = new EventEmitter<any>();

  imageUrl: string;


  constructor(
    public dataService: DataService,
    public kenticoTranslateService: KenticoTranslateService,
    ) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('checkout').pipe(take(1)).subscribe(item => {
      this.imageUrl = item.icon_user.value[0].url;
    });
  }

  editStep() {
    this.editStepButton.emit('address');
  }

}
