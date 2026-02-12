import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CarrefourConsentContent } from './carrefour-consent-condition.interface';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-step-payment-carrefour-consent',
  templateUrl: './checkout-step-payment-carrefour-consent.component.html',
  styleUrls: ['./checkout-step-payment-carrefour-consent.component.scss']
})

export class CheckoutStepPaymentCarrefourConsentComponent implements OnInit {
  carrefourcontent: CarrefourConsentContent;
  form: FormGroup;
  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
  ) { }

  dynamicText: string;

  ngOnInit() {
    this.getUtmSource();
    this.getContent();
    this.form = this.createForm();
  }
  private createForm(): FormGroup {
    return this.formBuilder.group({
      carrefourConsentConditions: [false, Validators.requiredTrue]
    });
  }

  private getContent(): void {
    this.kenticoTranslateService.getItem<any>('utm_consent_condition').subscribe(item => {
     const utm_sourceIsEqual = item.linked_items.value.find(u => u.utm_source.value === this.dynamicText);
      if (item !== undefined && utm_sourceIsEqual ) {
        this.carrefourcontent = {
          text: utm_sourceIsEqual.text.value
        };
      }
    });
  }

  getUtmSource() {
    this.route.queryParams.pipe(
      filter(params => params.utm_source))
      .subscribe( params => {
        this.dynamicText = params.utm_source;
      }
    );
  }

}
