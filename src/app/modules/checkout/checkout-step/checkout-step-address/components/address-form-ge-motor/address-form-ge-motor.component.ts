import { state } from '@angular/animations';
import { UserService } from './../../../../../../core/services/user.service';
import { DataService } from './../../../../../../core/services/data.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { take, tap } from 'rxjs/operators';
import { AuthService, InsurancesService } from '@services';
import { CheckoutStepInsuranceInfoComponent } from '../../../checkout-step-insurance-info/checkout-step-insurance-info.component';
import { City } from '@model';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { forkJoin } from 'rxjs';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-address-form-ge-motor',
    templateUrl: './address-form-ge-motor.component.html',
    styleUrls: ['./address-form-ge-motor.component.scss'],
    standalone: false
})
export class AddressFormGeMotorComponent implements OnInit {

  @Output() showOptinalWarrantiesEmit = new EventEmitter<any>();
  @Output() ownerSubmit = new EventEmitter<any>();

  listTopon = [
    { codDatoAssoluto: '1', descrizione: 'Via', descBrev: 'V.' },
    { codDatoAssoluto: '2', descrizione: 'Viale', descBrev: 'V.LE' },
    { codDatoAssoluto: '3', descrizione: 'Piazza', descBrev: 'P.ZA' },
    { codDatoAssoluto: '4', descrizione: 'Corso', descBrev: 'C.SO' },
    { codDatoAssoluto: '5', descrizione: 'Strada', descBrev: 'STR.' },
    { codDatoAssoluto: '6', descrizione: 'Vicolo', descBrev: 'VICOLO' },
    { codDatoAssoluto: '7', descrizione: 'Contrada', descBrev: 'CONTRADA' },
    { codDatoAssoluto: '8', descrizione: 'Largo', descBrev: 'L.GO' },
    { codDatoAssoluto: '9', descrizione: 'Piazzale', descBrev: 'P.LE' },
    { codDatoAssoluto: '10', descrizione: 'Localita', descBrev: 'LOC.' },
    { codDatoAssoluto: '11', descrizione: 'Salita', descBrev: 'SAL.' },
    { codDatoAssoluto: '12', descrizione: 'Circonvallazione', descBrev: 'CIRC.NE' },
    { codDatoAssoluto: '13', descrizione: 'Traversa', descBrev: 'TRAV.' },
    { codDatoAssoluto: '14', descrizione: 'Borgo', descBrev: 'B.GO' },
    { codDatoAssoluto: '15', descrizione: 'Frazione', descBrev: 'FRAZ.' },
    { codDatoAssoluto: '16', descrizione: 'Lungotevere', descBrev: 'L.TEVERE' },
    { codDatoAssoluto: '17', descrizione: 'Sestriere', descBrev: 'SESTIERE' },
    { codDatoAssoluto: '18', descrizione: 'Villaggio', descBrev: 'VILLAGIO' },
    { codDatoAssoluto: '19', descrizione: 'Piazzetta', descBrev: 'P.TTA' },
    { codDatoAssoluto: '20', descrizione: 'Galleria', descBrev: 'GALL.' },
    { codDatoAssoluto: '21', descrizione: 'Viottolo', descBrev: 'VIOTT' },
    { codDatoAssoluto: '99', descrizione: 'Altro', descBrev: '' },
  ];
  form: UntypedFormGroup;
  responseOrder: any;
  owner: any;
  countries: any;
  states: any;
  province: any;
  user: any;
  birthCity: City;
  defaultCountry: any;
  disabledButton: Boolean = true;
  kenticoContent: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dataService: DataService,
    public insuranceService: InsurancesService,
    public userService: UserService,
    protected nypUserService: NypUserService,
    private authService: AuthService,
    public infoComponent: CheckoutStepInsuranceInfoComponent,
    private modalService: NgbModal,
    public kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit() {
    this.user = this.authService.loggedUser;
    this.responseOrder = this.dataService.getResponseOrder();
    this.getOwner();
    this.createForm();
    this.kenticoTranslateService.getItem<any>('checkout_motor_genertel').pipe(take(1)).subscribe(item => {
      this.kenticoContent = item;
    });
    this.getCountries();
    this.getOwnerBirthInfo();
    this.toponomasticConverter();
    this.setDefaultCountry();
  }


  getOwner() {
    if (this.responseOrder.data.quotation_response.additional_data.preventivoAggregatori.codRelazioneRuoli === 3) {
      this.owner = this.responseOrder.data.quotation_response.additional_data.preventivoAggregatori.ruoli.find(x => x.codTipoRuolo === 'PRO')
    } else {
      this.owner = this.responseOrder.data.quotation_response.additional_data.preventivoAggregatori.ruoli[0];
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      ownerName: [this.owner.personaFisica.nome, Validators.required],
      ownerSurname: [this.owner.personaFisica.cognome, Validators.required],
      gender: [{ value: this.owner.personaFisica.sesso === 'F' ? 'Donna' : 'Uomo', disabled: false }, Validators.required],
      taxCode: [{ value: this.owner.personaFisica.codiceFiscale, disabled: false }, Validators.required],
      residentialCountry: [{ value: null, disabled: true }, Validators.required],
      residentialStates: [{ value: null }, Validators.required],
      residentialCity: [this.owner.indirizzoResidenza.comune, Validators.required],
      domicileToponymCode: [null, Validators.required],
      domicileStreetName: [this.owner.indirizzoResidenza.nomeVia, Validators.required],
      domicileHouseNumber: [this.owner.indirizzoResidenza.numeroCivico, Validators.required],
      postCode: [this.owner.indirizzoResidenza.cap, Validators.required],
      birthCity: [null, Validators.required],
      birthDate: [{ value: this.owner.personaFisica.dataNascita, disabled: false }, Validators.required],
    });
  }

  noChangeAllowed(event) {
    const id = event.srcElement.id;
    const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    (<ContainerComponent>modalRef.componentInstance).type = 'ModalOwnerAdressFormComponent';
    (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': this.kenticoContent };
    modalRef.result.then(result => {
      if (result === 'ok') {
        this.disabledButton = false;
      }
    });
    (<HTMLInputElement>document.getElementById(id)).readOnly = true;
  }

  setDefaultCountry() {
    this.countries.map(r => {
      if (r.id === 110) {
        this.form.get('residentialCountry').patchValue(r);
      }
    });
  }

  fromFormGroupToInsuredSubject(group: UntypedFormGroup): any {
    const owner = {
      quotation_address_attributes: {
        firstname: group.controls.ownerName.value,
        lastname: group.controls.ownerSurname.value,
        taxcode: group.controls.taxCode.value,
        domicile_country_id: Number(group.controls.residentialCountry.value.id),
        domicile_state_id: Number(group.controls.residentialStates.value.id),
        domicile_city: group.controls.residentialCity.value,
        domicile_toponym_code: group.controls.domicileToponymCode.value,
        domicile_street_name: group.controls.domicileStreetName.value,
        domicile_house_number: group.controls.domicileHouseNumber.value,
        domicile_zipcode: group.controls.postCode.value,
        birth_city: group.controls.birthCity.value,
        birth_date: group.controls.birthDate.value
      }
    };
    return owner;
  }

  submit() {
    this.ownerSubmit.emit(this.fromFormGroupToInsuredSubject(this.form));
    this.infoComponent.handleNextStep();
  }

  showOptinalWarranties() {
    this.showOptinalWarrantiesEmit.emit();
  }

  getCountries() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).pipe(take(1)).subscribe(res => {
      this.countries = res;
    });
  }

  getStates() {
    this.nypUserService.getProvince(110).pipe(take(1)).subscribe(res => {
      this.states = res;
    });
  }

  getOwnerBirthInfo() {
    const state$ = this.nypUserService.getProvince(110).pipe(take(1))
    const city$ = this.userService.getCitiesByCatastale(this.owner.personaFisica.codLuogoNascita);
    forkJoin([state$, city$]).pipe(
      tap(([states, city]) => {
        this.birthCity = city[0];
        this.form.controls.birthCity.patchValue(this.birthCity.name);
        this.states = states;
        const state = states.find(x => x.abbr === this.owner.indirizzoResidenza.codProvincia);
        this.form.get('residentialStates').patchValue(state);
      })).subscribe();
  }

  toponomasticConverter() {
    this.listTopon.forEach(item => {
      if (item.codDatoAssoluto === this.owner.indirizzoResidenza.codToponomastico) {
        this.form.controls.domicileToponymCode.patchValue(item.descrizione);
      }
    });
  }

}
