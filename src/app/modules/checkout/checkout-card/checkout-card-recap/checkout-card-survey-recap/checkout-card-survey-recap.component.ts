import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import {DataService} from '@services';
import { CheckoutProduct } from 'app/modules/checkout/checkout.model';

@Component({
  selector: 'app-checkout-card-survey-recap',
  templateUrl: './checkout-card-survey-recap.component.html',
  styleUrls: ['./checkout-card-survey-recap.component.scss']
})
export class CheckoutCardRecapSurveyComponent implements OnInit {

  @Input() product: CheckoutProduct;
  @Output() editStepButton = new EventEmitter<any>();
  imageUrl: any;

  constructor(public kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService
    ) {}

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('checkout').pipe(take(1)).subscribe(item => {
      this.imageUrl = item.icon_payment.value[0].url;
    });
  }

  editStep() {
    this.editStepButton.emit('survey');
  }

}
