import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, UserService } from '@services';

@Component({
  selector: 'app-address-form-genertel-sci',
  templateUrl: './address-form-genertel-sci.component.html',
  styleUrls: ['./address-form-genertel-sci.component.scss']
})
export class AddressFormGenertelSciComponent implements OnInit {

  @Output() formValidityUpdate = new EventEmitter<FormGroup>();
  @Input() contractorAddressForm: FormGroup;
  @Input() kenticoContent: any;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    protected nypUserService: NypUserService
  ) { }

  form: FormGroup;
  currentCountry: any;
  residentialStates: any;
  residenceCities: any;

  ngOnInit() {
    this.createContractorAddressForm();
    this.getCurrentCountry();
  }

  private createContractorAddressForm(): void {
    this.form = this.formBuilder.group({
      residenceState: [null, Validators.required],
      residenceCity: [null, Validators.required],
      postalCode: [null, [Validators.required, Validators.pattern('^[0-9]+[0-9]*$')]],
      address: [null, [Validators.required, Validators.pattern('([a-zA-Zìèéòàù\']+\ *)+')]],
      civicNumber: [null, Validators.compose([Validators.required, Validators.pattern('^[(+).0-9\]{0,15}$')])]
    });
    this.form.valueChanges.subscribe(changes => {
      if (!!changes.residenceState) {
        this.getResidentialCity(changes.residenceState.id);
      }
    });
    if (!!this.contractorAddressForm) {
      this.form.setValue({
        ...this.contractorAddressForm.value
      })
    }
    this.form.valueChanges.subscribe(changes => {
      if (!!changes.residenceState) {
        this.getResidentialCity(changes.residenceState.id);
      }
    });
    this.form.valueChanges.subscribe(() => this.emitForm());
  }

  private emitForm(): void {
    this.formValidityUpdate.emit(this.form);
  }

  getCurrentCountry() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe((res) => {
      const state = res.find((element) => element.iso === 'IT');
      this.currentCountry = state.id;
      this.getResidentialProvince(this.currentCountry);
    });
  }
  getResidentialProvince(currentCountry) {
    this.nypUserService.getProvince(currentCountry).subscribe(states => {
      this.residentialStates = states;
    });
  }
  getResidentialCity(currentProvince) {
    this.nypUserService.getCities(currentProvince).subscribe(cities => {
      this.residenceCities = cities;
    });
  }
  setCap() {
    this.form.get("postalCode").setValue(this.form.get("residenceCity").value.zipcode);
  }
  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }


}
