import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { DataService, UserService } from '@services';

@Component({
  selector: 'app-checkout-step-insurance-info-y-multirisk-data-insured',
  templateUrl: './checkout-step-insurance-info-y-multirisk-data-insured.component.html',
  styleUrls: ['./checkout-step-insurance-info-y-multirisk-data-insured.component.scss'],
  standalone: false
})
export class CheckoutStepInsuranceInfoYMultiriskDataInsuredComponent implements OnInit {
  form: UntypedFormGroup;
  cities: any;
  @Output() operation: EventEmitter<string> = new EventEmitter<string>();
  @Output() previousStep = new EventEmitter<string>();
  @Input() provinceNameSelected: string;
  @Input() provinceIdSelected: number;
  @Input() zipCodeSelected: any;
  @Input() addressSelected: string;
  @Input() citySelected: any;
  city: any;
  filteredCity: any[] = [];
  searchCity = new UntypedFormControl("");
  inputCity: string = '';

  constructor(
    public userService: UserService,
    private fb: UntypedFormBuilder,
    protected nypUserService: NypUserService,
    public data: DataService
  ) { }

  ngOnInit(): void {
    this.loadCity();
    this.form = this.fb.group({
      address: ['', Validators.required],
      searchCity: [new UntypedFormControl(this.searchCity, Validators.required)],
      province: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
  }

  loadCity() {
    this.nypUserService.getCitiesByProvincia(this.provinceIdSelected).then((cities) => {
      this.cities = cities;
      this.fillAllCity();
      if (this.citySelected != undefined) {
        let cityFind = this.cities.find((el) => el.name === this.citySelected.name);
        this.form.controls.searchCity.patchValue(cityFind);
        this.form.updateValueAndValidity();
      }
    });
  }

  backSubStep() {
    this.previousStep.emit('prev');
  }

  displayWith(value) {
    return value ? value.name : null;
  }

  selectedValueCity(option: MatOption) {
    this.city = option.value
  }

  onChangeInputCity() {
    if (this.filteredCity != undefined) {
      this.filteredCity.splice(0);
    }

    if (this.inputCity.length === 1) {
      this.cities.forEach((prov) => {
        if (prov.name[0].toLocaleLowerCase() === this.inputCity.toLocaleLowerCase()) {
          let p = {
            abbr: prov.abbr,
            cities_required: prov.cities_required,
            country_id: prov.country_id,
            id: prov.id,
            name: prov.name,
            filterName: prov.name
          }
          this.filteredCity.push(p);
        }
      });
    } else if (this.inputCity.length >= 2) {
      this.cities.forEach((prov) => {
        if (prov.name.toLocaleLowerCase().startsWith(this.inputCity.toLocaleLowerCase())) {
          let p = {
            abbr: prov.abbr,
            cities_required: prov.cities_required,
            country_id: prov.country_id,
            id: prov.id,
            name: prov.name,
            filterName: prov.name
          }
          this.filteredCity.push(p);
        }
      });
    } else {
      this.fillAllCity();
    }

    if (this.filteredCity != undefined && this.filteredCity.length > 0 && this.inputCity.length > 0) {
      this.filteredCity.forEach((prov, i) => {
        this.filteredCity[i].filterName = prov.name.toLocaleLowerCase().replace(this.inputCity.toLocaleLowerCase(), '<span class="selectLetterColor">' + this.inputCity.toLocaleLowerCase() + '</span>');
      });
    }
  }

  private fillAllCity() {
    if (this.cities != undefined) {
      this.cities.forEach((prov) => {
        let p = {
          abbr: prov.abbr,
          cities_required: prov.cities_required,
          country_id: prov.country_id,
          id: prov.id,
          name: prov.name,
          filterName: prov.name
        }
        this.filteredCity.push(p);
      });
    }
  }
}
