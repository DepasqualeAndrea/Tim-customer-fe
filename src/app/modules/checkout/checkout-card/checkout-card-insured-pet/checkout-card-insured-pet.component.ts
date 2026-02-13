import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';
import {PetsAttributes} from '@model';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HelperDate, NgbDateHelper } from 'app/shared/ngb-date-helper';
import { DataService } from './../../../../core/services/data.service';

@Component({
    selector: 'app-checkout-card-insured-pet',
    templateUrl: './checkout-card-insured-pet.component.html',
    styleUrls: ['./checkout-card-insured-pet.component.scss'],
    standalone: false
})
export class CheckoutCardInsuredPetComponent implements OnInit {

  @Input() product: any;
  @Input() maxDateBirthday: NgbDate;
  @Input() kenticoBody: any;
  @Input() races: string[];
  @Input() isRaceBlocked: boolean;
  @Input() isTypeBlocked: boolean;
  @Output() saveInsuredPetEmit = new EventEmitter<any>();

  formInsuredPet: UntypedFormGroup;
  petsForm: UntypedFormArray;
  petsProduct: PetsAttributes[];
  minDateBirthday: NgbDate = this.dateHelper.getPreviousDateFromToday(10, 'years').add(1, 'day')
  tenant: string;
  tenantClass: string;
  petsStorage = null;
  isSameMicrochip = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private dateHelper: NgbDateHelper,
    public dataService: DataService) {
  }

  ngOnInit() {
    this.getStoredPets();
    this.petsProduct = this.product.order.line_items[0].insured_entities.pets[0];
    this.addValueInPetsProduct();
    this.formInsuredPet = this.formBuilder.group({
      pets: this.formBuilder.array([]),
    });
    this.addPetInArrayForm(this.petsProduct.length);
    this.tenant = this.dataService.tenantInfo.tenant;
  }

  public getTenantClass(): string {
   return this.tenantClass = this.tenant + ' ' + 'col-7';
  }

  private createPetFromArray(pet: PetsAttributes): UntypedFormGroup {
    return this.formBuilder.group({
      type: [{value: pet.kind || null, disabled: this.isTypeBlocked}, Validators.required],
      name: [pet.name || null, Validators.required],
      birthday: [pet.birth_date && this.dateHelper.stringifyNgbDate(pet.birth_date) || null, Validators.required],
      microchip: [pet.microchip_code || null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(15)]],
      race: [{value: pet.breed || null, disabled: this.isRaceBlocked}, Validators.required]
    });
  }

  private addPetInArrayForm(quantity: number): void {
    this.petsForm = this.formInsuredPet.controls.pets as UntypedFormArray;
    for (let i = 0; i < quantity; i++) {
      const petForm = this.createPetFromArray(this.petsProduct[i])
      petForm.addValidators(
        this.dateHelper.createDateValidator(
          petForm,
          'birthday',
          this.minDateBirthday,
          this.maxDateBirthday
        )
      )
      this.petsForm.push(petForm);
    }
  }

  displayFieldCss(pet: any, field: string) {
    return {
      'error-field': this.isFieldValid(pet, field),
    };
  }

  isFieldValid(pet: any, field: string) {
    return !pet.get(field).valid && pet.get(field).touched;
  }

  onFormChanges() {
    this.formInsuredPet.valueChanges.subscribe(val => {
      val.pets.forEach((element, index, array) => {
        switch (val.pets.length) {
          case 2:
            if (this.formInsuredPet.controls.pets.value[0].microchip !== null
              && this.formInsuredPet.controls.pets.value[1].microchip !== null) {
              if (array[index].microchip === array[index + 1 ].microchip) {
                this.isSameMicrochip = true;
                this.formInsuredPet.setErrors({ 'invalid': true });
              } else {
                this.isSameMicrochip = false;
              }
            }
            break;
            case 3:
              if (this.formInsuredPet.controls.pets.value[0].microchip !== null
                && this.formInsuredPet.controls.pets.value[1].microchip !== null
                && this.formInsuredPet.controls.pets.value[2].microchip !== null) {
              if (array[0].microchip === array[1].microchip
                || array[0].microchip === array[2].microchip
                || array[1].microchip === array[2].microchip) {
                this.isSameMicrochip = true;
                this.formInsuredPet.setErrors({ 'invalid': true });
              } else {
                this.isSameMicrochip = false;
              }
            }
            break;
            default:  this.isSameMicrochip = false;
            break;
        }
      });
    });
  }

  computeModel(): PetsAttributes[] {
    return this.fromViewToModel(this.formInsuredPet);
  }

  fromViewToModel(form: UntypedFormGroup): PetsAttributes[] {
    const pets: UntypedFormArray = <UntypedFormArray>form.controls.pets;
    const transformed: PetsAttributes[] = [];
    for (let i = 0; i < pets.length; i++) {
      transformed.push(this.fromFormGroupToInsuredSubject(<UntypedFormGroup>pets.at(i), i));
    }
    return transformed;
  }

  fromFormGroupToInsuredSubject(group: UntypedFormGroup, index: number): PetsAttributes {
    const date = group.controls.birthday.value
    const pet = {
      birth_date: date,
      kind: group.controls.type.value,
      microchip_code: group.controls.microchip.value,
      name: group.controls.name.value,
      breed: group.controls.race.value,
      id: this.petsProduct[index].id
    };
    return pet;
  }

  private getStoredPets(): void {
    const storedPets = localStorage.getItem('pets');
    if (storedPets) {
      this.petsStorage = JSON.parse(storedPets)
    } else {
      this.petsStorage = null;
    }
  }

  private addValueInPetsProduct(): void {
    if (this.petsStorage) {
      for (let i = 0; i < this.petsProduct.length; i++) {
          this.petsProduct[i].name = this.petsStorage[i].name
          this.petsProduct[i].birth_date = this.petsStorage[i].birth_date
          this.petsProduct[i].microchip_code = this.petsStorage[i].microchip_code
          if (this.petsProduct[i].birth_date === this.petsStorage[i].birth_date) {
            this.petsProduct[i].birth_date = this.convertDataForPetsProductArray(this.petsStorage[i].birth_date);
          }
      }
    }
  }

  private convertDataForPetsProductArray(birthDate: string): NgbDateStruct {
    const date = new Date(birthDate)

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return {
      day: day,
      month: month,
      year: year,
    }
  }

}
