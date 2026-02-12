import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { DataService, UserService } from '@services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, switchMap, tap, map } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { NypUserService } from '@NYP/ngx-multitenant-core';

interface EmployeeBuildingBed {
  [key: string]: any;
}

@Component({
  selector: 'app-checkout-step-insurance-info-y-multirisk-form',
  templateUrl: './checkout-step-insurance-info-y-multirisk-form.component.html',
  styleUrls: ['./checkout-step-insurance-info-y-multirisk-form.component.scss']
})
export class CheckoutStepInsuranceInfoYMultiriskFormComponent implements OnInit, AfterViewInit, AfterViewChecked {
  form: FormGroup;
  provinces: any;
  province: any;
  employees: EmployeeBuildingBed;
  buildings: EmployeeBuildingBed;
  beds: EmployeeBuildingBed;
  @Output() operation: EventEmitter<string> = new EventEmitter<string>();
  @Input() dataModify: any;
  @Input() provinceForModify: any;
  filteredProvince: any[] = [];
  searchProvince = new FormControl("");
  provincia: any;
  hasBeds: boolean;
  inputProvince: string = '';
  originalProvinces: any;
  empSelected: any;
  bedsSelected: any;
  buildSelected: any;

  constructor(
    public userService: UserService,
    protected nypUserService: NypUserService,
    private fb: FormBuilder,
    public data: DataService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.hasBeds = this.data.params.has_beds;
    this.getContentDataDropdown();
    this.getProvincia();

    if (this.hasBeds) {
      this.form = this.fb.group({
        employeesNumber: [null, Validators.required],
        bedsNumber: [null, Validators.required],
        buildingType: [null, Validators.required],
      });
    } else {
      this.form = this.fb.group({
        employeesNumber: [null, Validators.required],
        buildingType: [null, Validators.required],
      });
    }
  }

  ngAfterViewInit(): void {
    this.setDataFromModify();
    this.form.updateValueAndValidity();
  }

  getProvincia() {
    this.nypUserService.getDefaultCountry().pipe(
      switchMap(defaultCountry => this.nypUserService.getProvince(defaultCountry.id)),
      tap(states => {
        this.provinces = states;
        this.fillAllProvince();
      }
      ),
    ).subscribe()
  }

  onChangeInputProvince() {
    if (this.filteredProvince != undefined) {
      this.filteredProvince.splice(0);
    }

    if (this.inputProvince.length === 1) {
      this.provinces.forEach((prov) => {
        if (prov.name[0].toLocaleLowerCase() === this.inputProvince.toLocaleLowerCase()) {
          let p = {
            abbr: prov.abbr,
            cities_required: prov.cities_required,
            country_id: prov.country_id,
            id: prov.id,
            name: prov.name,
            filterName: prov.name
          }
          this.filteredProvince.push(p);
        }
      });
    } else if (this.inputProvince.length >= 2) {
      this.provinces.forEach((prov) => {
        if (prov.name.toLocaleLowerCase().startsWith(this.inputProvince.toLocaleLowerCase())) {
          let p = {
            abbr: prov.abbr,
            cities_required: prov.cities_required,
            country_id: prov.country_id,
            id: prov.id,
            name: prov.name,
            filterName: prov.name
          }
          this.filteredProvince.push(p);
        }
      });
    } else {
      this.fillAllProvince();
    }

    if (this.filteredProvince != undefined && this.filteredProvince.length > 0 && this.inputProvince.length > 0) {
      this.filteredProvince.forEach((prov, i) => {
        this.filteredProvince[i].filterName = prov.name.toLocaleLowerCase().replace(this.inputProvince.toLocaleLowerCase(), '<span class="selectLetterColor">' + this.inputProvince.toLocaleLowerCase() + '</span>');
      });
    }
  }

  private fillAllProvince() {
    if (this.provinces != undefined) {
      this.provinces.forEach((prov) => {
        let p = {
          abbr: prov.abbr,
          cities_required: prov.cities_required,
          country_id: prov.country_id,
          id: prov.id,
          name: prov.name,
          filterName: prov.name
        }
        this.filteredProvince.push(p);
      });
    }
  }

  displayWith(value) {
    return value ? value.name : null;
  }

  selectedValueProvince(option: MatOption) {
    this.provincia = option.value;
  }

  getContentDataDropdown() {
    this.userService.getDataDropdown()
      .subscribe(
        (data) => {
          this.employees = data.employees_number;
          this.beds = data.beds_number;
          this.buildings = data.building_type;
        }
      );
  }
  ngAfterViewChecked() {
    this.ref.detectChanges();
  }

  nextStep() {
    if (this.form.valid && this.provincia !== undefined) {
      this.operation.emit('next');
    }
  }

  setDataFromModify() {
    this.data.getRedirectShoppingCartMultirisk()
      .pipe(filter((data) => data !== ''))
      .subscribe(() => {
        if (this.dataModify !== undefined) {
          this.empSelected = this.dataModify.employeesNumber;
          if (this.hasBeds) {
            this.bedsSelected = this.dataModify.bedsNumber;
          }
          this.buildSelected = this.dataModify.buildingType;
          this.searchProvince.setValue(this.provinceForModify);
          this.provincia = this.provinceForModify;
        }
        ;
      })
  }

}
