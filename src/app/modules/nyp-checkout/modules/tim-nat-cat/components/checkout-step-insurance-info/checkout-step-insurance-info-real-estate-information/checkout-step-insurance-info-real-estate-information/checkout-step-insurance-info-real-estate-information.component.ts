import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, State } from '@model';
import { NypUserService } from '@NYP/ngx-multitenant-core';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { distinctUntilChanged, map, switchMap, take, toArray } from 'rxjs/operators';
import { InsuranceInfoStates, TimNatCatCheckoutService } from '../../../../services/checkout.service';
import { concat, Observable, of } from 'rxjs';
import { IOrderResponse, NatCatnsuredItems, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { TimNatCatService } from '../../../../services/api.service';
import { AuthService, DataService } from '@services';
import { AnnoDiCostruzione, MaterialeDiCostruzione, NumeroPianiEdificio, PianoPiuBassoOccupato } from "app/modules/nyp-checkout/modules/tim-nat-cat/building-enum";
import { HttpClient } from '@angular/common/http';


export const ContraenteProprietarioEConduttore = {
  Si: true,
  No: false
};

export type ContraenteProprietarioEConduttore = typeof ContraenteProprietarioEConduttore[keyof typeof ContraenteProprietarioEConduttore];

@Component({
  selector: 'app-checkout-step-insurance-info-real-estate-information',
  templateUrl: './checkout-step-insurance-info-real-estate-information.component.html',
  styleUrls: [
    './checkout-step-insurance-info-real-estate-information.component.scss',
    '../../../../../../styles/checkout-forms.scss',
    '../../../../../../styles/size.scss',
    '../../../../../../styles/colors.scss',
    '../../../../../../styles/text.scss',
    '../../../../../../styles/common.scss'],
})
export class CheckoutStepInsuranceInfoRealEstateInformationComponent implements OnChanges {
  @Input() API_KEY?: string = 'AIzaSyBexfHEd_JaLQtrPLZjcpKoUDzo1EaXN9o';
  @Input() kenticoContent: any;
  @Output() currentState: EventEmitter<string> = new EventEmitter();

  isMobile: boolean = window.innerWidth < 768;
  form: FormGroup;
  startingData: any;
  states: State[] = [];
  residentialCities: City[] = [];
  questions: any[] = [];
  mainQuestion: any;
  insuranceInfoState: InsuranceInfoStates = 'realEstateInformation';
  openedIndex: number | null = null;

  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
  }

  constructor(
    private fb: FormBuilder,
    public nypDataService: NypDataService,
    private nypUserService: NypUserService,
    public checkoutService: TimNatCatCheckoutService,
    private apiService: TimNatCatService,
    private authService: AuthService,
    private httpClient: HttpClient
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kenticoContent'] && this.kenticoContent?.questions?.value?.length) {
      this.setMainQuestion();
      this.setQuestions();
      this.buildForm();
      this.getState();
      this.setupLocationFieldHandlers();
      this.startingData = this.fromViewToModel();
      if (this.isNonEmptyObject( this.nypDataService.Order$?.value?.orderItem[0]?.insured_item)) {
        this.loadOrderData();
      }
    }
  }

  isNonEmptyObject(obj: any): boolean {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length > 0;
  }

  setQuestions(): void{
    this.questions = this.kenticoContent.questions.value.map((q: any) => {
      return {
        id: q.system.id,
        name: q.system.codename,
        title: q.title?.resolvedData?.html || '',
        answers: (q.items?.value || []).map((a: any) => ({
          id: a.system.id,
          value: a.title?.resolvedData?.html || ''
        }))
      };
    });
  }

  setMainQuestion(): void{
    this.mainQuestion = this.kenticoContent.main_question.value.map((q: any) => {
      return {
        id: q.system.id,
        name: q.system.codename,
        title: q.title?.resolvedData?.html || '',
        answers: (q.items?.value || []).map((a: any) => ({
          id: a.system.id,
          value: a.title?.resolvedData?.html || ''
        }))
      };
    });
  }

  loadOrderData(): void {
    const orderCode = this.nypDataService.Order$.value?.orderCode;
    if (!orderCode) return;

    this.nypUserService.getProvince(110).pipe(
      take(1),
      switchMap(states => {
        this.states = states;
        this.form.get('residentialState')!.enable();

        return this.apiService.getOrder(orderCode).pipe(take(1));
      }),
      switchMap(order => {
        const orderStateName = order?.orderItem?.[0]?.insured_item?.provincia;
        const stateObj = this.states.find(s => s.name === orderStateName) || null;

        if (stateObj) {
          return this.nypUserService.getCities(stateObj.id).pipe(
            take(1),
            map(cities => {
              this.residentialCities = cities || [];
              const modelData = this.fromModelToView(order.orderItem[0]?.insured_item);
              return modelData;
            })
          );
        } else {
          return of(this.fromModelToView());
        }
      })
    ).subscribe(mappedData => {
      Object.keys(this.form.controls).forEach(controlName => {
        if (mappedData.hasOwnProperty(controlName)) {
          this.form.get(controlName)?.patchValue(mappedData[controlName]);
        }
      });
      this.updateFieldStates();
    });
  }

  private readonly questionEnumMap: { [questionName: string]: any } = {
    materialedicostruzione: MaterialeDiCostruzione,
    annodicostruzione: AnnoDiCostruzione,
    numeropianiedificio: NumeroPianiEdificio,
    pianopiubassooccupato: PianoPiuBassoOccupato,
    contraenteproprietarioeconduttore: ContraenteProprietarioEConduttore
  };


  buildForm(): void {
    const group: any = {
      residentialState: [null, Validators.required],
      residentialCity: [{ value: null, disabled: true }, Validators.required],
      residentialAddress: [{ value: '', disabled: true }, Validators.required],
      zipCode: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{5}$/)]]
    };
    this.questions.forEach(q => {
      group[q.id] = [null, Validators.required];
    });
    group[this.mainQuestion[0].id] = [null, Validators.required];
    this.form = this.fb.group(group);
  }

  setupLocationFieldHandlers(): void {
  this.form.get('residentialState')!.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((state: State | null) => {
      this.clearAndDisable('residentialCity');
      this.clearAndDisable('residentialAddress');
      this.clearAndDisable('zipCode');

      if (state) {
        this.getCity(state);
      }
    });

    this.form.get('residentialCity')!.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((city) => {
      this.clearAndDisable('residentialAddress');
      this.clearAndDisable('zipCode');

      if (city) {
        this.form.get('residentialAddress')!.enable();
      }
    });

    this.form.get('residentialAddress')!.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((addr: string) => {
      this.clearAndDisable('zipCode');
      if (addr?.trim()) {
        this.form.get('zipCode')!.enable();
      }
    });

    this.form.get('zipCode')!.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(() => {
      if (this.areLocationFieldsFilled()) {
      } else {
        this.resetQuestions();
      }
    });
}

  clearAndDisable(field: string): void {
    const control = this.form.get(field);
    if (!control?.disabled) {
      control.reset();
      control.disable();
    }
  }

  updateFieldStates(): void {
    const { residentialState, residentialCity, residentialAddress, zipCode } = this.form.controls;
    residentialState.value ? residentialCity.enable({ emitEvent: false }) : this.clearAndDisable('residentialCity');
    residentialCity.value ? residentialAddress.enable({ emitEvent: false }) : this.clearAndDisable('residentialAddress');
    residentialAddress.value?.trim() ? zipCode.enable({ emitEvent: false }) : this.clearAndDisable('zipCode');

    if (!this.areLocationFieldsFilled()) {
      this.questions.forEach(q => {
        this.form.get(q.id.toString())?.reset();
      });
    }
  }

  getState(): void {
    this.nypUserService.getProvince(110).pipe(take(1)).subscribe({
      next: (provinces) => {
        this.states = provinces;
        this.form.get('residentialState')!.enable();
      },
      error: (err) => {
        console.error('Errore nel recupero delle province:', err);
        this.states = [];
        this.form.get('residentialState')!.disable();
      }
    });
  }

  getCity(state: State | null): void {
  this.nypUserService.getCities(state.id).pipe(take(1)).subscribe(cities => {
    this.residentialCities = cities || [];
   this.form.get('residentialCity')!.enable();
   this.form.get('residentialCity')!.reset();
  });
}

  private resetQuestions(): void {
    this.questions.forEach(q => {
    this.form.get(q.id.toString())?.reset();
  });
  }

  areLocationFieldsFilled(): boolean {
  const v = this.form.getRawValue();
  return !!(v.residentialState && v.residentialCity && v.residentialAddress?.trim() && /^[0-9]{5}$/.test(v.zipCode));
  }

  customCompare(o1, o2) { return o1?.id === o2?.id; }

  areAllQuestionsAnswered(): boolean {
    return this.questions.every(q => {
      return this.form.get(q.id.toString())?.value != null;
    });
  }

  sanitizeId(questionId: string, option: string): string {
    return `${questionId}-${option.replace(/\s+/g, '-')}`;
  }


mapQuestionsFields(data: any): any {
  const result: any = {};
  Object.entries({
    materialedicostruzione: data.materialeDiCostruzione,
    annodicostruzione: data.annoDiCostruzione,
    numeropianiedificio: data.numeroPianiEdificio,
    pianopiubassooccupato: data.pianoPiuBassoOccupato,
    contraenteproprietarioeconduttore: data.contraenteProprietarioEConduttore
  }).forEach(([questionName, enumValue]) => {
    const question = this.questions.find(q => q.name === questionName) || this.mainQuestion.find(q => q.name === questionName);
    if (question) {
      result[question.id.toString()] = this.findAnswerIdByEnum(questionName, enumValue);
    }
  });
  if (data.provincia) {
    const stateObj = this.states.find(p => p.name === data.provincia);
    if (stateObj) result.residentialState = stateObj;
  }
  if (data.comune) {
    const cityObj = this.residentialCities.find(c => c.name === data.comune);
    if (cityObj) result.residentialCity = cityObj;
  }
  if (data.indirizzo) result.residentialAddress = data.indirizzo;
  if (data.cap) result.zipCode = data.cap;
  return result;
}

  fromModelToView(data?:any) {
    let mapped: any;
    if (data) {
      mapped = this.mapQuestionsFields(data);
    }
    return mapped;
  }

  private findAnswerIdByEnum(questionName: string, enumValue: any): string | null {
    if (enumValue == null) return null;
    const enumType = this.questionEnumMap[questionName];
    if (!enumType) return null;
    const enumKey = Object.keys(enumType).find(key => enumType[key] === enumValue);
    if (!enumKey) return null;
    const question = questionName === 'contraenteproprietarioeconduttore' ? this.mainQuestion.find(q => q.name === questionName) : this.questions.find(q => q.name === questionName) ;
    if (!question) return null;
    const enumValues = Object.values(enumType).filter(v => typeof v === typeof enumValue);
    const index = enumValues.indexOf(enumValue);
    if (index === -1) return null;
    if (question.answers && question.answers.length > index) {
      return question.answers[index].id;
    }
    return null;
  }

  fromViewToModel(): any {
    const value = this.form.getRawValue();
    return {
      state: value.residentialState?.name ?? null,
      city: value.residentialCity?.name ?? null,
      address: value.residentialAddress,
      zipcode: value.zipCode
    };
  }

  hasChanged(): boolean { return JSON.stringify(this.fromViewToModel()) !== JSON.stringify(this.startingData); }

  buildQuestionPayload(): { [key: string]: number | boolean } {
    const value = this.form.getRawValue();
    const payload: { [key: string]: number | boolean } = {};
    this.questions.forEach(q => {
      const selectedId = value[q.id];
      if (selectedId != null) {
        const enumMap = this.questionEnumMap[q.name];
        if (!enumMap) return;
          const enumValues = Object.values(enumMap).filter(v => typeof v === 'number') as number[];
          const index = q.answers.findIndex(a => a.id === selectedId);
          if (index === -1) return;
          payload[q.name] = enumValues[index];
      }
    });
    if( this.mainQuestion[0].name === 'contraenteproprietarioeconduttore'){
      const selectedId = value[this.mainQuestion[0].id];
      const answerIndex = this.mainQuestion[0].answers.findIndex(a => a.id === selectedId);
      if (answerIndex === -1) return;
      const boolValues = Object.values(ContraenteProprietarioEConduttore);
      payload[this.mainQuestion[0].name] = boolValues[answerIndex];
    }
    return payload;
  }

  private updateOrder(): Observable<(RecursivePartial<IOrderResponse<NatCatnsuredItems>> | void)[]> {
    const formValue = this.form.getRawValue();
    const questionPayload = this.buildQuestionPayload();
    const insuredItems = {
      cap: formValue.zipCode,
      indirizzo: formValue.residentialAddress,
      comune: formValue.residentialCity?.name ?? null,
      provincia: formValue.residentialState?.name ?? null,
      provinciaAbbr: formValue.residentialState?.abbr ?? null,
      materialeDiCostruzione: questionPayload['materialedicostruzione'] as number | undefined,
      annoDiCostruzione: questionPayload['annodicostruzione'] as number | undefined,
      numeroPianiEdificio: questionPayload['numeropianiedificio'] as number | undefined,
      pianoPiuBassoOccupato: questionPayload['pianopiubassooccupato'] as number | undefined,
      contraenteProprietarioEConduttore: questionPayload['contraenteproprietarioeconduttore'] as boolean | undefined,
    }
    return concat(
      this.apiService.putOrder({
        orderCode: this.nypDataService.Order$.value.orderCode,
        customerId: this.authService.loggedUser?.id,
        productId: this.nypDataService.CurrentProduct$.value?.id,
        insuredItems: insuredItems,
        anagState: 'Draft',
        start_date: this.nypDataService.Order$.value?.orderItem?.[0]?.start_date
      })
    ).pipe(toArray(), take(1));
  }

  handleNextStep(): void {
    if (!this.form.valid) return;
    // this.checkExistUserAddress(this.form).then(() => {
      this.updateOrder().subscribe((response: (RecursivePartial<IOrderResponse<NatCatnsuredItems>> | void)[]) => {
      localStorage.setItem('order', JSON.stringify(response[0]));
      const formValue = this.form.getRawValue();
      const questionPayload = this.buildQuestionPayload();
      this.checkoutService.ChosenConf$.next({
        cap: formValue.zipCode,
        indirizzo: formValue.residentialAddress,
        comune: formValue.residentialCity?.name ?? null,
        provincia: formValue.residentialState?.name ?? null,
        materialeDiCostruzione: questionPayload['materialedicostruzione'] as number | undefined,
        annoDiCostruzione: questionPayload['annodicostruzione'] as number | undefined,
        numeroPianiEdificio: questionPayload['numeropianiedificio'] as number | undefined,
        pianoPiuBassoOccupato: questionPayload['pianopiubassooccupato'] as number | undefined,
        contraenteProprietarioEConduttore: questionPayload['contraenteproprietarioeconduttore'] as boolean | undefined,
      });
      this.currentState.emit( this.checkoutService.InsuranceInfoState$.value);
      this.checkoutService.InsuranceInfoState$.next('choicePacket');
      });
    // });
  }

  getCheckedStyle(id: string): boolean {
    const el= document.getElementById(id) as HTMLInputElement;
    return el?.checked;
  }

  async checkExistUserAddress(formData: FormGroup) {
    if ((formData?.value?.residentialCity?.name || formData?.value?.residentialCity) && formData?.value?.residentialAddress) {
      const capField = formData.get("zipCode");
      const city = typeof formData?.value?.residentialCity === "string"
        ? formData?.value?.residentialCity
        : formData?.value?.residentialCity?.name;
      const address = formData?.value?.residentialAddress;
      const zipCode: any = await this.zipCodeValidation(`${city},${address}`);
      const targetPostalCode = zipCode?.results[0]?.address_components?.find((component: any) =>
        component.types.includes("postal_code")
      );
      if (targetPostalCode?.long_name) {
        capField?.setValue(targetPostalCode?.long_name);
      } else {
        capField?.setErrors({ customError: 'Cap non coerente', errorMessage: "Cap non coerente" })
      }
    }
  }

  async zipCodeValidation(address: string) {
    const options = {};
    const queryOptions = {
      address,
      key: this.API_KEY,
      language: 'it',
    };
    const API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const queryString = this.encodeQuery(queryOptions);
    const basePath = API_URL + queryString;

    return this.httpClient
      .get(basePath, options)
      .toPromise()
      .then((response: any) => { return response; })
      .catch((err: any) => {
        console.log('zipCodeValidationError', err);
      });
  }

  encodeQuery(data: any) {
    let ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
  }
}
