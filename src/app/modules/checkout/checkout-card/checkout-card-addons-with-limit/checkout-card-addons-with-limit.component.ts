import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {TimeHelper} from '../../../../shared/helpers/time.helper';
import * as moment from 'moment';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {Addon} from '@model';
import {CheckoutService, DataService} from '@services';

@Component({
    selector: 'app-checkout-card-addons-with-limit',
    templateUrl: './checkout-card-addons-with-limit.component.html',
    styleUrls: ['./checkout-card-addons-with-limit.component.scss'],
    standalone: false
})
export class CheckoutCardAddonsWithLimitComponent implements OnInit {

  @Input() product: any;
  @Output() selectedAddonsEmit = new EventEmitter<any>();
  @Output() formTravelCancellationValid = new EventEmitter<boolean>();

  productAddons: Addon[];
  destinations: any[];
  valuePurchaseInput: string;
  formTravelCancellation: UntypedFormGroup;
  ngbDatePurchase: NgbDate;
  minDatePurchase: any;
  maxDatePurchase: any;


  constructor(private formBuilder: UntypedFormBuilder,
              private checkoutService: CheckoutService,
              public dataService: DataService) {
  }

  ngOnInit() {
    this.productAddons = this.product.originalProduct.addons;
    this.destinations = this.product.order.line_items[0].insurance_info.destinations;
    this.createFormTravelCancellation();
    this.addParametersToAddon();
    this.maxDatePurchase = TimeHelper.fromDateToNgbDate(moment().toDate());
    this.minDatePurchase = TimeHelper.fromDateToNgbDate(moment().subtract(1, 'd').toDate());
  }

  toggleAddon(addon, index) {
    if (addon.mandatory) {
      return;
    }

    addon.selected = !addon.selected;

    if (addon.code === 'IVNR00104' && !this.formTravelCancellation.valid) {
      if(!addon.selected) {
        this.formTravelCancellationValid.emit(true);
      } else {
        this.validateAllFormFields(this.formTravelCancellation);
      }
    }

    this.listSelectedAddons();
  }

  toggleAddonLimit(selectedMaximal, index) {
    this.productAddons[index].selectedMaximal = selectedMaximal;
    if (this.productAddons[index].selected) {
      this.listSelectedAddons();
    }
  }

  toogleDatePurchase(date, index, addon) {
    if (!this.isFieldValid('datePurchaseForm') && this.productAddons[index].selected) {
      this.productAddons[index].datePurchase = (date && date.day && date.month && date.year) ? this.formatDate(date) : this.productAddons[index].datePurchase;
      this.listSelectedAddons();
    }
  }

  toogleValueTravel(addon, index) {
    this.productAddons[index].valueTravel = !this.valuePurchaseInput || this.fromStringToNumber(this.valuePurchaseInput);
    if (!this.isFieldValid('valueTravelForm') && this.productAddons[index].selected) {
      this.listSelectedAddons();
    }
  }

  listSelectedAddons() {
    const selectedAddons = this.productAddons.filter(addon => addon.selected);
    this.checkoutService.setAddonsStepInsuranceInfo(selectedAddons);
    this.selectedAddonsEmit.emit(selectedAddons);
  }

  isDisabled(addon) {
    return addon.mandatory;
  }

  addParametersToAddon() {
    this.productAddons.forEach(addon => {
      if (this.isMandatoryAddon(addon)) {
        Object.assign(addon, {selected: true, mandatory: true});
      }
      if (addon.code === 'IVNR00104') {
        Object.assign(addon, {valueTravel: addon.valueTravel ? this.insertValueTravelAddon(addon) : ''});
        Object.assign(addon, {datePurchase: addon.datePurchase ? this.insertDatePurchaseAddon(addon) : ''});
      }
      if (addon.ceilings) {
        Object.assign(addon, {selectedMaximal: addon.selectedMaximal || addon.ceilings[0]});
        if (addon.code === 'IVNR00102') {
          const checkCodeDestination = this.checkCodeTravelDestination();
          if (checkCodeDestination === 1) {
            addon.ceilings = addon.ceilings.slice(0, 1);
          }
          if (checkCodeDestination === 2
            || ((checkCodeDestination === 3 || checkCodeDestination === 4) && this.product.duration > 60)) {
            // delete ultimate 2 value of array
            addon.ceilings = addon.ceilings.slice(0, 6);
          }
        }
      }
    });
    const selectedAddons = this.productAddons.filter(addon => addon.selected);
    this.checkoutService.setAddonsStepInsuranceInfo(selectedAddons);
  }

  insertDatePurchaseAddon(addon: Addon) {
    this.ngbDatePurchase = this.formatDateToNgbDate(addon.datePurchase);
    return addon.datePurchase;
  }

  formatDate(date: NgbDate) {
    // NgbDates use 1 for Jan, Moment uses 0, must substract 1 month for proper date conversion
    const ngbObjDate = JSON.parse(JSON.stringify(date));
    const datePurchase = moment();

    if (ngbObjDate) {
      ngbObjDate.month--;
      datePurchase.month(ngbObjDate.month);
      datePurchase.date(ngbObjDate.day);
      datePurchase.year(ngbObjDate.year);
    }

    return datePurchase.toDate().toISOString();
  }

  formatDateToNgbDate(date: string) {
    const newDate = new Date(date);
    return new NgbDate(newDate.getFullYear(), newDate.getMonth(), newDate.getDay());
  }

  isFieldValid(field: string) {
    return !this.formTravelCancellation.get(field).valid && this.formTravelCancellation.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'error-field': this.isFieldValid(field),
    };
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({onlySelf: true});
      }
    });
  }

  createFormTravelCancellation() {
    this.formTravelCancellation = this.formBuilder.group({
      valueTravelForm: [null, Validators.required],
      datePurchaseForm: [null, Validators.required]
    });

    this.formTravelCancellation.statusChanges.subscribe((value) => {
      if(value === 'VALID') {
        this.formTravelCancellationValid.emit(true);
      } else {
        this.formTravelCancellationValid.emit(false);
      }
    });
  }

  controlFormTravelCancellation(formGroup: UntypedFormGroup) {
    if (!this.formTravelCancellation.valid) {
      this.validateAllFormFields(formGroup);
    }
  }

  fromStringToNumber(data: string) {
    const valArray = data.split(',');
    for (let i = 0; i < valArray.length; ++i) {
      valArray[i] = valArray[i].replace(/\D/g, '');
    }
    let numberToParse = valArray[0];
    if (valArray.length > 1) {
      numberToParse += '.' + valArray[1].substring(0, 2);
    }
    return Number(numberToParse);
  }

  isMandatoryAddon(addon: Addon) {
    return addon.taxons.find(taxon => taxon.name === 'mandatory');
  }

  checkCodeTravelDestination() {
    return Math.max.apply(Math, this.destinations.map(destination => {
      return destination.area;
    }));
  }

  private insertValueTravelAddon(addon: Addon) {
    this.valuePurchaseInput = addon.valueTravel;
    return addon.valueTravel.toString();
  }


}
