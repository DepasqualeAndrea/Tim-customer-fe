import { InsurancesService } from './../../../../core/services/insurances.service';
import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarAttributes } from '@model';
import { take } from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: 'app-checkout-card-insurance-info-auto-form',
  templateUrl: './checkout-card-insurance-info-auto-form.component.html',
  styleUrls: ['./checkout-card-insurance-info-auto-form.component.scss']
})
export class CheckoutCardInsuranceInfoAutoFormComponent implements OnInit {

  @Input() product: any;
  @Output() changeInfoCar = new EventEmitter<any>();

  form: FormGroup;
  FormGroup: any;
  vehicleData: any;
  car: any;
  setUpsList: any;
  defaultSetUp = [];

  listAlarm = [
    'Nessun antifurto',
    'Meccanico',
    'Allarme',
    'Vetri marchiati',
    'Immobilizzatore senza allarme',
    'Immobilizzatore con allarme',
    'Satellitare'
  ];


  constructor(
    private formBuilder: FormBuilder,
    private insuranceService: InsurancesService
  ) {
  }

  ngOnInit() {
    this.vehicleData = this.product.order.data.quotation_response.additional_data.preventivoAggregatori.veicolo;
    this.car = this.product.order.line_items[0].insured_entities.car;
    this.getMotorSetUps();
    this.form = this.formBuilder.group({
      registrationYear: [{ value: this.vehicleData.annoImmatricolazione, disabled: true }, Validators.required],
      brandModel: [{ value: this.vehicleData.descrizioneMarca ? this.vehicleData.descrizioneMarca + ' ' + this.vehicleData.descrizioneModello :  this.vehicleData.descrizioneModello, disabled: false }, Validators.required],
      setUp: [{ value: null }, Validators.required],
      weight: [{ value: this.car.weight ? this.car.weight.toString() : null, disabled: true }, Validators.required],
      vehicleValue: [{ value: this.car.value, disabled: false }],
      airBag: [{ value: this.car.in_secure_location, disabled: false }, Validators.required],
      vehicleIsSafe: [{ value: this.car.has_abs, disabled: false }, Validators.required],
      abs: [{ value: this.car.has_abs, disabled: false }, Validators.required],
      theftProtection: [{ value: this.car.alarm, disabled: false }, Validators.required],
      yearlyKm: [{ value: this.car.annual_km, disabled: false }, Validators.required],
      driverAge: [{ value: this.car.expert_driver, disabled: false }, Validators.required],
      universalClass: [{ value: this.vehicleData.classeUniversale, disabled: true }, Validators.required],
      assignClass: [{ value: this.vehicleData.classeAssegnazione, disabled: true }, Validators.required],
      usageType: [{ value: this.car.usage || 'Privato', disabled: true }, Validators.required],
      fuel: [{ value: this.car.power_supply, disabled: true }, Validators.required],
    });
    this.checkBrandModelEditable();
  }

  private checkBrandModelEditable(): void {
    this.product.code === 'ge-motor-car' ? this.form.controls['brandModel'].disable() : this.form.controls['brandModel'].enable();
  }

  private getMotorSetUps(): void {
    if (this.product.code === 'ge-motor-car') {
      const request = {
        token: null,
        tenant: 'yolo',
        product_code: this.product.code,
        product_data: {
          brand_code: this.vehicleData.codiceMarca,
          model_code: this.vehicleData.codiceModello,
          year: moment(this.vehicleData.dataImmatricolazione).format('YYYY')
        }
      };
      this.insuranceService.getMotorSetUps(request).pipe(take(1)).subscribe(res => {
        this.setUpsList = res.additional_data.listaAllestimenti;
        this.setUpsList.map(item => {
          if (this.vehicleData.codiceAllestimento === item.codAllestimento) {
            this.form.get('setUp').patchValue(item);
          }
          else if(this.setUpsList.length === 1){
            this.form.get('setUp').patchValue(item);
          }
        });
      });
    }
  }


  computeModel(): CarAttributes {
    return this.fromViewToModel(this.form);
  }

  fromViewToModel(form: FormGroup): CarAttributes {
    const cars = form;
    return this.fromFormGroupToInsuredSubject(<FormGroup>cars);
  }

  fromFormGroupToInsuredSubject(group: FormGroup): CarAttributes {
    const car = {
      registration_year: group.controls.registrationYear.value,
      anno_presentazione: group.controls.setUp.value.annoPresentazione,
      mese_presentazione: group.controls.setUp.value.mesePresentazione,
      model: group.controls.brandModel.value,
      brand: this.vehicleData.descrizioneMarca,
      displacement: group.controls.setUp.value.codAllestimento,
      value: group.controls.vehicleValue.value,
      has_airbag: group.controls.airBag.value,
      in_secure_location: group.controls.vehicleIsSafe.value,
      has_abs: group.controls.abs.value,
      alarm: group.controls.theftProtection.value,
      annual_km: group.controls.yearlyKm.value,
      expert_driver: group.controls.driverAge.value,
      universal_class: group.controls.universalClass.value,
      genertel_evaluation_class: 0,
      assignClass: group.controls.assignClass.value,
      usage: group.controls.usageType.value,
      power_supply: group.controls.fuel.value,
      license_plate: this.vehicleData.numTarga,
      id: this.car.id
    };
    const van = {
      ...car,
      weight: Number(group.controls.weight.value)
    };
    delete van.displacement;
    const vehicle = this.product.code === 'ge-motor-car' ? car : van;
    return vehicle;
  }

  calculatePrice() {
    this.changeInfoCar.emit();
  }
}
