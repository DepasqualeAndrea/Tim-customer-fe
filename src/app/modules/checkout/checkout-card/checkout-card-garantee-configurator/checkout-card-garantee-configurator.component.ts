import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService } from '@services';
import { RecursivePartial, IOrderResponse, NatCatnsuredItems } from 'app/modules/nyp-checkout/models/api.model';
import { InsuranceInfoCustomRequestModalComponent } from 'app/modules/nyp-checkout/modules/tim-nat-cat/modal/insurance-info-custom-request-modal/insurance-info-custom-request-modal.component';
import { InsuranceInfoDetailsModalComponent } from 'app/modules/nyp-checkout/modules/tim-nat-cat/modal/insurance-info-details-modal/insurance-info-details-modal.component';
import { TimNatCatService } from 'app/modules/nyp-checkout/modules/tim-nat-cat/services/api.service';
import { TimNatCatCheckoutService } from 'app/modules/nyp-checkout/modules/tim-nat-cat/services/checkout.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { catchError, take, toArray } from 'rxjs/operators';
import { Observable, concat, of } from 'rxjs';
import { ModalWarrantyDetailComponent } from 'app/modules/nyp-checkout/modules/tim-nat-cat/modal/modal-warranty-detail/modal-warranty-detail.component';

export enum NatCatPacket {
  ter_all_fra_owner = 'tim-natcat-owner',
  ter_all_fra_rented = 'tim-natcat-rented'
}

@Component({
  selector: 'app-checkout-card-garantee-configurator',
  templateUrl: './checkout-card-garantee-configurator.component.html',
  styleUrls: [ './checkout-card-garantee-configurator.component.scss'  ]
})



export class CheckoutCardGaranteeConfiguratorComponent implements OnInit, OnChanges, AfterViewInit{
  @Input() kenticoContent!: any;
  public Order$ = this.nypDataService.Order$;
  public quoteSuccessful: boolean | null = null;
  private hasChanged = false;
  form: FormGroup;
  packetList: any[] = [];
  packetToShow: any;
  chosenWarrantiesToSend: any[]= [];
  currentProduct: any;
  quoteResponse: any;
  @Input() previousInsuranceInfoState: any;
  @ViewChild('infoBox', { static: false }) infoBox: ElementRef;

  constructor(private fb: FormBuilder,
    private apiService: TimNatCatService,
    private nypDataService: NypDataService,
    public modalService: NgbModal,
    public dataService: DataService,
    private checkoutService: TimNatCatCheckoutService,
    private authService: AuthService,
    private renderer: Renderer2 ) { }

  ngOnInit(): void {
    this.buildForm();
    if(this.kenticoContent){
      this.setPacketsObj();
    }
    this.currentProduct = this.nypDataService.CurrentProduct$.value;
    this.form.valueChanges.subscribe(() => {
      this.hasChanged = true;
      this.quoteSuccessful = null;
    });
  }

  ngAfterViewInit(): void {
    if (this.infoBox) {
      const links = this.infoBox.nativeElement.querySelectorAll('a[href="custom_quote"], a[href="http://custom_quote"]');
      links.forEach((link: HTMLAnchorElement) => {
        this.renderer.setAttribute(link, 'href', '#');
        this.renderer.listen(link, 'click', (event) => {
          event.preventDefault();
          this.openCustomPolicyModal();
        });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['previousInsuranceInfoState']) {
    const curr = changes['previousInsuranceInfoState'].currentValue;
    this.apiService.getOrder(this.nypDataService.Order$.value.orderCode).subscribe((order: any) => {
      this.packetToShow = this.currentProduct.packets.find(el => el.id === this.nypDataService.Order$.value.orderItem[0].instance.filterPackets[0].id);
        if (curr !== 'choicePacket' && curr !== 'realEstateInformation') {
          this.getWarranties(order.orderItem[0].instance?.chosenWarranties?.data?.warranties, true);
          this.updatePrices();
        }else{
          this.getWarranties(this.packetToShow.warranties, false);
        }
      this.setChosenWarranties();
    });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      contenuto: [null],
      fabbricato_e_terreno: [null],
      merci: [null],
      contenutoMaximal: [null],
      fabbricato_e_terrenoMaximal: [null],
      merciMaximal: [null]
    });

    this.form.valueChanges.subscribe(() => {
    this.quoteSuccessful = null;
    });
  }

  getCheckedStyle(id: string): boolean {
    const el= document.getElementById(id) as HTMLInputElement;
    return el?.checked;
  }

  setPacketsObj(): void{
    Object.keys(this.kenticoContent.packet_configurations).forEach((packetConf: any) => {
      if (Object.keys(NatCatPacket).includes(packetConf)) {
        const tempObj = {
          key: packetConf,
          value: this.kenticoContent.packet_configurations[packetConf]
        }
        this.packetList.push(tempObj);
      }
    });
  }

  handleChange(event: any): void{
    const controlName = event.target.id;
    const control = this.form.get(controlName);
    const controlMaximal = this.form.get(controlName + 'Maximal');
    if (control?.value) {
      controlMaximal?.enable();
      controlMaximal?.setValidators([Validators.required]);
    } else {
      controlMaximal?.disable();
      controlMaximal?.clearValidators();
      controlMaximal?.setValue(null);
    }
    controlMaximal?.updateValueAndValidity();
  }


  getWarranties(warranties: any[], prefillCeiling: boolean): void{
    let controlName: string;
    warranties.forEach((warranty: any) => {
      controlName = this.getControlName(warranty);
      const controlNameMaximal = this.getControlName(warranty) + "Maximal";
      if (warranty.mandatory) {
        this.form.get(controlName)?.patchValue(true);
        this.form.get(controlName)?.disable();
        this.form.get(controlNameMaximal)?.setValidators([Validators.required, Validators.min(1)]);
        this.form.get(controlNameMaximal)?.updateValueAndValidity();
      } else {
        this.form.get(controlNameMaximal)?.disable();
        this.form.get(controlName)?.clearValidators();
      }
      if(prefillCeiling){
        this.form.get(controlName)?.patchValue(true);
        this.form.get(controlNameMaximal)?.enable();
        const warrantyCeiling = Number(warranty.ceilings.selected);
        this.form.get(controlNameMaximal)?.patchValue(warrantyCeiling);
      }
    });
    warranties.forEach((warranty: any) => {
      const matchingKeys = Object.keys(this.form.controls).filter((key) => key.toLowerCase().includes(this.getControlName(warranty)));
      matchingKeys.forEach((el) => {
        this.form.get(el + "Maximal")?.valueChanges.subscribe((change) => {
          const insertedCeiling = Number(change);
          const warrantyCeiling = Number(warranty.ceilings.range[1]);
          const minimalCeiling = Number(warranty.ceilings.range[0]);
          if (!isNaN(insertedCeiling) && !isNaN(warrantyCeiling)) {
            if (insertedCeiling < minimalCeiling || insertedCeiling > warrantyCeiling) {
              this.form.get(el + 'Maximal')?.setErrors({ ceilingExceeded: true });
            }
          }
        });
      });
    });
  }

  handleQuote(): Observable<(RecursivePartial<IOrderResponse<NatCatnsuredItems>> | void)[]>{
    return concat(this.apiService.quote({
      data: {
        customerId: this.nypDataService.Order$.value?.customerId,
        orderId: this.nypDataService.Order$.value.id,
        productId: this.currentProduct.id
      }
    })
    ).pipe(toArray(),take(1));
  }

  getEnumKeyByValue(enumObj: any, value: number | string): string | undefined {
   return Object.keys(enumObj).find(key => enumObj[key] === value);
  }

  openPacketDetail(): void {
    let filteredLabel = this.getEnumKeyByValue(NatCatPacket, this.packetToShow.sku);
    const filteredWarrantyContent = this.packetList.find(el=> el.key === filteredLabel)?.value;
    const modalRef = this.modalService.open(InsuranceInfoDetailsModalComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    modalRef.componentInstance.kenticoContent = filteredWarrantyContent.modal_packet_details.packet_modal_info;
    modalRef.componentInstance.packetTitle = filteredWarrantyContent.title.value;
  }

  openWarrantyDetail(warrantyName: string): void {
    const modalRef = this.modalService.open(ModalWarrantyDetailComponent, { size: 'lg',  centered: true,backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    modalRef.componentInstance.kenticoContent = this.kenticoContent.warranty_configurations[warrantyName];
    modalRef.componentInstance.iconClose = this.kenticoContent?.modal_icon_close;
  }

  openCustomPolicyModal(): void {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(InsuranceInfoCustomRequestModalComponent, {
      size: 'lg',
      backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout,
      windowClass: 'modal-window',
      container: 'body' 
    });
    modalRef.componentInstance.kenticoContent = this.kenticoContent?.modal_request_custom?.modal_request_custom;
    modalRef.componentInstance.formSubmitted = false;
    if (modalRef.componentInstance.form) {
      modalRef.componentInstance.form.reset();
    }
    modalRef.componentInstance._modalRef = modalRef;
  }

  getControlName(warranty: any, condition?: string): string {
    return warranty.name.toLowerCase().replace(/\s+/g, '_') + (condition ? condition : '');
  }

  private updateOrder(): Observable<(RecursivePartial<IOrderResponse<NatCatnsuredItems>> | void)[]> {
    return concat(
      this.apiService.putOrder({
        orderCode: this.nypDataService.Order$.value.orderCode,
        customerId: this.authService.loggedUser?.id,
        productId: this.currentProduct.id,
        packet: this.packetToShow,
        anagState: 'Draft',
        chosenWarranties: this.chosenWarrantiesToSend,
      })
    ).pipe(toArray(),take(1));
  }

  verifyControlsWithMaximal(): boolean {
    return this.packetToShow.warranties.every((warranty: any) => {
      const control = this.form.get(this.getControlName(warranty));
      const controlMaximal = this.form.get(this.getControlName(warranty) + 'Maximal');
      if (control?.value === true) {
        return controlMaximal?.value !== null && controlMaximal?.value !== undefined && controlMaximal?.value !== '';
      }
      return true;
    });
  }

  setChosenWarranties(){
    this.chosenWarrantiesToSend = [];
    this.packetToShow.warranties.forEach((warranty: any) => {
    const control = this.form.get(this.getControlName(warranty));
    const controlMaximal = this.form.get(this.getControlName(warranty) + 'Maximal');
    const allMandatoryFilled = this.packetToShow.warranties.filter((warranty: any) => warranty.mandatory).every((warranty: any) => {
    const controlMaximal = this.form.get(this.getControlName(warranty) + 'Maximal');
      return controlMaximal?.value !== null && controlMaximal?.value !== undefined && controlMaximal?.value !== ''; });
      if(allMandatoryFilled && this.verifyControlsWithMaximal()){
        if (control?.value && controlMaximal?.value ) {
          warranty.ceilings['selected']= controlMaximal.value
          warranty = {...warranty};
          this.chosenWarrantiesToSend.push(warranty);
        }
      }
    });
  }

  handleNextStep(): void {
    this.setChosenWarranties();
    this.updateOrder().subscribe((response: (RecursivePartial<IOrderResponse<NatCatnsuredItems>> | void)[]) => {
      this.checkoutService.InsuranceInfoState$.next('paymentSplitSelection');
    });
  }

  updateOrderQuoteValues(){
    this.setChosenWarranties();
    this.updateOrder().subscribe((response: (RecursivePartial<IOrderResponse<NatCatnsuredItems>> | void)[]) => {
    });
  }

  handlePrevStep(): void {
    this.nypDataService.Quote$.next(undefined);
    this.packetToShow = {};
    this.chosenWarrantiesToSend = [];
    if (this.form) {
    Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        control?.reset();
        control?.clearValidators();
        control?.updateValueAndValidity();
      });
    }
    this.checkoutService.InsuranceInfoState$.next('realEstateInformation');
  }

  validateForm(){
    return this.form.valid && this.quoteSuccessful === true;
  }

  updatePrices(): void {
  if (!this.hasChanged) {
      return;
  }
  if (this.form.invalid) {
    return;
  }
  this.hasChanged = false;
  this.setChosenWarranties();
  if (this.chosenWarrantiesToSend.length > 0) {
    this.updateOrder().subscribe(() => {
      this.handleQuote().pipe(
        catchError((err) => {
          this.nypDataService.Quote$.next( err?.error as any);
          this.quoteSuccessful = false;
          return of(undefined);
        })
      ).subscribe((res) => {
        if (res) {
          this.nypDataService.Quote$.next(res);
          this.quoteResponse = res;
          this.quoteSuccessful = true;
          this.apiService.getOrder(this.nypDataService.Order$.value.orderCode).subscribe((order) => this.nypDataService.Order$.next(order));
        }
      });
    });
  }
}

  showWarrantyPrices(warrantyName: string) {
    if (!this.quoteResponse || !this.quoteResponse.length) return '-';
    const entry = this.quoteResponse[0].warranties?.find(w => w[warrantyName]);
    if (!entry || !entry[warrantyName]) return '-';
    const total = entry[warrantyName].total ?? 0;
    return Number(total).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }


  areAllPricesAvailable(): boolean {
    if (!this.quoteSuccessful || !this.quoteResponse?.length) {
      return false;
    }
    const mandatoryWarranties = this.chosenWarrantiesToSend.filter(w => w.mandatory);
    return mandatoryWarranties.every(warranty => {
      const key = this.getControlName(warranty);
      const quoteEntry = this.quoteResponse[0].warranties
      .find(item => item[key] !== undefined);
      return !!quoteEntry && quoteEntry[key].total > 0;
    });
  }

    onMaximalInput(controlName: string, event: Event): void {
      const input = event.target as HTMLInputElement;
      const raw = input.value.replace(/\./g, '').replace(/\D/g, '');
      const ctrl = this.form.get(controlName)!;
      ctrl.setValue(raw);
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
      const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      input.value = formatted;
    }
}
