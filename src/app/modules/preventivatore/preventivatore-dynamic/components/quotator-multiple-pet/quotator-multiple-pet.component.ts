import { CheckoutDocumentAcceptanceService } from './../../../../checkout/checkout-step/checkout-step-payment/checkout-step-payment-document-acceptance.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InsurancesService, DataService } from '@services';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { PaymentPeriodCode, PetKind, PetKindLabel, PetRace, PetsCollection, PetsIndexer, RequestPetKind } from './quotator-multiple-pet.types';
import { Addon } from 'app/core/models/insurance.model';

@Component({
  selector: 'app-quotator-multiple-pet',
  templateUrl: './quotator-multiple-pet.component.html',
  styleUrls: ['./quotator-multiple-pet.component.scss']
})
export class QuotatorMultiplePetComponent extends PreventivatoreAbstractComponent implements OnInit {

  @Input()
  product;
  @Output()
  actionEvent = new EventEmitter<any>();
  @Output()
  swipeEvent = new EventEmitter<string>();

  maxPetsNumber: number;
  arrayFormNumberPet: any[];
  get numberPetArray(): number[] {
    return [...Array(this.maxPetsNumber).keys()].map( i => ++i);
  }
  addons: Addon[] = [];
  form: FormGroup;
  petFormArray: FormArray;
  startDate = moment();
  endDate = moment().add(12, 'month');
  petType: PetKindLabel[] = ['Cane', 'Gatto'];
  pets: PetsIndexer = [null];
  price = 0;
  get insuredPetForms(): AbstractControl[] {
    return (<FormArray>this.form.controls.insuredPets).controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private insuranceService: InsurancesService,
    ref: ChangeDetectorRef,
    public dataService: DataService,
    private acceptanceService: CheckoutDocumentAcceptanceService
  ) {
    super(ref);
  }


  ngOnInit() {
    this.setPets();
    this.maxPetsNumber = +this.product.properties.find(p => p.name === 'pets_number').value;
    this.addons = this.product.addons;
    this.createForm();
  }

  private setPets(): void {
    this.insuranceService.getPetsHelvetia().pipe(take(1)).subscribe((res: PetsCollection) => this.pets = [res]);
  }

  private choiseNumberPet(petsNumber: number): void {
    this.arrayFormNumberPet = [];
    for (let i = 1; i <= petsNumber; i++) {
      this.arrayFormNumberPet.push(i);
      if (this.petFormArray.length <= this.arrayFormNumberPet.length) {
        this.petFormArray.insert(i, this.createPetForm());
        this.petFormArray.removeAt(i);
      } else {
        while (this.arrayFormNumberPet.length < this.petFormArray.length) {
          this.petFormArray.removeAt(i);
        }
      }
    }
  }


  private createForm() {
    this.form = this.formBuilder.group({
      insuredPets: this.formBuilder.array([this.createPetForm()]),
      moreInfo: [null, Validators.requiredTrue],
      payment_frequency: [null, Validators.required],
      numberOfPetsToInsure: [null, Validators.required]
    });
    this.form.controls.numberOfPetsToInsure.valueChanges.subscribe(petsNumber =>
      this.choiseNumberPet(petsNumber)
    );
    return this.petFormArray = this.form.get('insuredPets') as FormArray;
  }

  private createPetForm(): FormGroup {
    return this.formBuilder.group({
      kind: new FormControl(null, Validators.required),
      breed: new FormControl(null, Validators.required),
    });
  }

  toggleSelectionAddons(addon): void {
    addon.selected = !addon.selected;
    this.calculatePrice();
  }

  private transformPaymentType(): PaymentPeriodCode {
    return this.form.controls.payment_frequency.value === 'yearly' ? 'Y' : 'M';
  }

  private createRequestObj() {
    const currentTenant = this.dataService.tenantInfo.tenant;
    const tenant = currentTenant.replace('_db', '');
    const pets = this.petFormArray.controls.map(item => {
      const kind: PetKind = item.value.kind === 'Gatto' ? 'cats' : 'dogs';
      const race = this.getPetRaceFromBreed(item.value.breed, kind);
      return {
        name: '',
        type: race.kind,
        breed: race.helvetia_code,
        microchip: '',
        birth_date: '',
      };
    });
    return {
      token: '',
      tenant: tenant,
      product_code: this.product.product_code,
      product_data: {
        variant_name: 'chiara_master',
        expiration_date: this.endDate,
        start_date: this.startDate,
        payment_frequency: this.transformPaymentType(),
        pets: pets,
        addons: this.addons.filter(a => a.selected).map(a => a.code)
      }
    };
  }

  calculatePrice(): void {
    if (this.petFormArray.valid && this.form.controls.payment_frequency.valid) {
      const request = this.createRequestObj();
      this.insuranceService.submitPetHelvetiaInsuranceQuotation(request).pipe(take(1)).subscribe(res => {
        localStorage.setItem('token-dhi', res.token);
        this.price = parseFloat(res.total.replace(',', '.'));
      });
    }
  }

  private createCheckoutPetsObject() {
    return this.petFormArray.controls.map(item => {
      const kind: RequestPetKind = item.value.kind === 'Cane' ? 'dog' : 'cat';
      return {
        id: '',
        name: '',
        kind: kind,
        breed: item.value.breed,
        microchip_code: '',
        birth_date: null,
      };
    });
  }

  checkout(): void {
    const line_items_attributes = {
      0: {
        variant_id: this.product.master_variant,
        expiration_date: this.endDate,
        start_date: this.startDate,
        quantity: 1,
        payment_frequency: this.transformPaymentType(),
        line_item_addons_attributes: this.addons.filter(a => a.selected).map(a => {
          return {
            addon_id: a.id,
            maximal: '75000'
          };
        }),
        insurance_info_attributes: {},
        instant: false,
        pet_attributes: this.createCheckoutPetsObject()
      }
    };
    const order = { order: { line_items_attributes } };
    this.sendCheckoutAction(order);

    if (this.dataService.tenantInfo.tenant === 'banco-desio_db' ||
      this.dataService.tenantInfo.tenant === 'civibank_db') {
        this.acceptanceService.documentAcceptance(true, this.product);
      }
  }

  private sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product'
      , payload: {
        product: this.product
        , order: order
        , router: 'checkout'
      }
    };
    localStorage.removeItem('CHECKOUT_OPENED_RESOLVER');
    this.emitActionEvent(action);
  }

  private emitActionEvent(action: any): void {
    this.actionEvent.next(action);
  }

  onSwipe(event): void {
    const direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    this.swipeEvent.next(direction);
  }

  private getPetRaceFromBreed(breed: PetKind, kind: string): PetRace {
    const selectedRace = this.pets[0][kind].find(race => race.breed === breed);
    return selectedRace;
  }

  openTooltip(tooltip, text: string) {
    tooltip.close();
    tooltip.open({ text });
  }

}
