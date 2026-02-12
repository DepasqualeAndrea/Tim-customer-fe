import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import moment from 'moment';
import { CheckoutStepInsuranceInfoMiFidoProduct, PetInfo } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-mi-fido/checkout-step-insurance-info-mi-fido.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { DataService } from '@services';

@Component({
  selector: 'app-checkout-card-insurance-info-tim-pet-insured-type-animal',
  templateUrl: './checkout-card-insurance-info-tim-pet-insured-type-animal.component.html',
  styleUrls: ['./checkout-card-insurance-info-tim-pet-insured-type-animal.component.scss']
})
export class CheckoutCardInsuranceInfoTimPetInsuredTypeAnimalComponent implements OnInit {

  @Input() product: CheckoutStepInsuranceInfoMiFidoProduct;
  @Input() kenticoItem: any;
  @Output() operation: EventEmitter<string> = new EventEmitter<string>();
  @Output() formUpdated: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() minDateAnimals: NgbDateStruct;
  @Input() maxDateAnimals: NgbDateStruct;
  form: FormGroup;
  contentItem: any;
  petLabel: string;
  petKind: string;
  kinds: any[];
  maxBirthDate: NgbDateStruct;
  minBirthDate: NgbDateStruct;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) {
  }

  ngOnInit() {
    this.minBirthDate = TimeHelper.fromDateToNgbDate(moment().subtract(9, 'y').add(1, 'day').toDate());
    this.maxBirthDate = TimeHelper.fromDateToNgbDate(moment().subtract(181, 'day').toDate());
    this.contentItem = this.kenticoItem.step_choose_animals.value[0];
    const kinds = this.product.order.line_items[0].pet_properties.kinds;
    this.kinds = Object.keys(kinds).map(k => ({ key: k, value: kinds[k] }));
    const product: CheckoutStepInsuranceInfoMiFidoProduct = Object.assign(this.product);
    this.form = this.formBuilder.group({
      petName: [product.petName || null, [Validators.required, Validators.maxLength(15)]],
      kind: [product.kind || 'dog', Validators.required],
      birthDate: [TimeHelper.fromDateToNgbDate(product.birthDate), Validators.required],
      microChip: [null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(15), Validators.maxLength(15)]]

    });
    this.form.valueChanges.subscribe((changes) => {
      this.selectPetType(changes.kind);
      this.formUpdated.emit(this.form);
    });
    if (!product.kind) {
      this.form.controls.kind.patchValue('dog');
      this.petKind = 'cane';
    } else {
      this.form.controls.kind.patchValue(product.kind);
    }
  }

  fromViewToModel(form: FormGroup): PetInfo {
    return {
      petName: form.controls.petName.value,
      kind: form.controls.kind.value,
      chip: form.controls.microChip.value,
      breed: null,
      birthDate: TimeHelper.fromNgbDateToDate(form.controls.birthDate.value),
      informationPackage: null,
    };
  }

  computeProduct(): PetInfo {
    const petInfo: PetInfo = this.fromViewToModel(this.form);
    Object.assign(this.product, petInfo);
    return <CheckoutStepInsuranceInfoMiFidoProduct>Object.assign({}, this.product, { insuredSubjects: null });
  }

  selectPetType(type: string): void {
    if (type === 'dog') {
      this.petKind = 'cane';
    } else {
      this.petKind = 'gatto';
    }
  }

  isFormValid(): boolean {
    return this.form.valid;
  }
  submit() {
    const form: any = {
      paymentmethod: '',
      mypet_pet_type: this.petKind,
      codice_sconto: 'no',
      sci_numassicurati: 0,
      sci_min14: 0,
      sci_polizza: '',
    }
    this.dataService.kind = this.petKind
    const number = this.product.order.id + '';
    let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.product, 1, number, {}, form, 'tim broker', '');
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);

    this.operation.emit('next');
  }

  previousPage() {
    window.history.back();
  }

}
