
import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services';
import { IProduct, RecursivePartial, ViaggiAnnualeInsuredItems } from 'app/modules/nyp-checkout/models/api.model';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of } from 'rxjs';
import { delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { InfoDetailsModalComponent } from '../../modal/info-details-modal/info-details-modal.component';
import { InfoLuggageModalComponent } from '../../modal/info-luggage-modal/info-luggage-modal.component';
import { MoreDetailsModalComponent } from '../../modal/more-details-modal/more-details-modal.component';
import { TimProtezioneViaggiAnnualeApiService } from '../../services/api.service';
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";
import { AdobeAnalyticsDatalayerService } from "app/core/services/adobe_analytics/adobe-init-datalayer.service";
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';

@Component({
    selector: 'app-preventivatore',
    templateUrl: './preventivatore.component.html',
    styleUrls: ['./preventivatore.component.scss', '../../../../../../styles/checkout-forms.scss', '../../../../../../styles/size.scss', '../../../../../../styles/colors.scss', '../../../../../../styles/text.scss', '../../../../../../styles/common.scss'],
    standalone: false
})
export class PreventivatoreComponent implements OnInit {
  selectedProduct: RecursivePartial<IProduct>;
  selectedPassengersCount: number = 0;
  form: UntypedFormGroup;
  showCalendar: boolean = false;
  isEurope: boolean = true;
  isWorld: boolean = false;
  destinationWorld: { [key: string]: string } = {};
  warranties = {
    europe: [],
    europe_luggage: [],
    world: [],
    world_luggage: [],
  };

  public isMobile: boolean = window.innerWidth < 768;
  public isTablet: boolean = window.innerWidth < 992;
  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
    this.isTablet = event.target.innerWidth < 992;
  }
  public ViaggiAnnualeProducts$ = this.nypDataService.Products$.pipe(
    map(p => p.filter(p => p.code.includes('tim-protezione-viaggi-annuale'))),
    map(packets => packets.sort((a, b) => {
      const order = ['tim-protezione-viaggi-europe-y', 'tim-protezione-viaggi-world-y'];
      return order.indexOf(a.code) - order.indexOf(b.code);
    }))
  );
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private apiService: NypApiService,
    private timProtezioneViaggiAnnualeApiService: TimProtezioneViaggiAnnualeApiService,
    private authService: AuthService,
    private nypDataService: NypDataService,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.kenticoTranslateService.getItem<any>('tim_protezione_viaggi').pipe(take(1)).subscribe(item => {
      const productName = item?.system?.name;
      let digitalData: digitalData = window["digitalData"];
      digitalData.page.category.primaryCategory = `${productName} annuali`;
      digitalData.page.pageInfo.pageName = "tim-protezione-viaggi_annuali preventivatore";
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    });

    this.nypDataService.redirectIfUndefinedProduct();
    this.form = this.formBuilder.group({
      destinazione: [''],
      passengers: [this.selectedPassengersCount, Validators.required],
      extra: ['none', Validators.required]
    });

    // this.form.valueChanges
    //   .pipe(filter(() => this.form.valid))
    //   .subscribe((f => {
    //     //this.aggiornaECalcola().subscribe();
    //   }));

    this.nypDataService.Products$.value?.
      find(p => p.code == 'tim-protezione-viaggi-europe-y')?.packets?.[0]?.warranties.
      sort((a, b) => a?.ceilings?.ceilings?.[0] - b?.ceilings?.ceilings?.[0]).
      forEach(w => {
        if (['EAM', 'EAA'].includes(w.anagWarranty.internal_code)) {
          this.warranties.europe.push(w);
        } else {
          this.warranties.europe_luggage.push(w);
        }
      });

    this.nypDataService.Products$.value?.find(p => p.code == 'tim-protezione-viaggi-world-y')?.packets?.[0]?.warranties.
      sort((a, b) => a?.ceilings?.ceilings?.[0] - b?.ceilings?.ceilings?.[0]).
      forEach(w => {
        if (['EAA', 'EARC', 'EAM'].includes(w.anagWarranty.internal_code)) {
          this.warranties.world.push(w);
        } else {
          this.warranties.world_luggage.push(w);
        }
      });

    this.apiService.postOrder({
      customerId: this.authService.loggedUser?.id,
      packetId: this.nypDataService.CurrentProduct$.value?.packets?.find(p => p.preselected)?.id ?? this.nypDataService.CurrentProduct$.value?.packets?.[0]?.id,
      productId: this.nypDataService.CurrentProduct$.value?.id,
    }).subscribe(order => {
      this.getCountries();


      this.ViaggiAnnualeProducts$.subscribe(products => {
        const smart = products.find(product => product.code === 'tim-protezione-viaggi-europe-y');
        const deluxe = products.find(product => product.code === 'tim-protezione-viaggi-world-y');

        if (smart) {
          this.selectProduct(smart);
        } else if (deluxe) {
          this.selectProduct(deluxe);
        }
      });
      this.changeDestination('europe');
    });
    this.aggiorna().subscribe()
  }

  selectProduct(product: RecursivePartial<IProduct>): void {
    this.selectedProduct = product;
    this.nypDataService.CurrentProduct$.next(product);
    console.log('Selected Product:', this.selectedProduct);
    this.aggiorna().subscribe();
    of(null).pipe(
      delay(1500),
      tap(() => this.getCountries())
    ).subscribe();
    this.selectedPassengersCount = 0;
    this.form.get('passengers').setValue(this.selectedPassengersCount);
  }

  private updateSelectedProduct(code: string): void {
    this.nypDataService.Products$.pipe(
      map(products => products.find(product => product.code === code))
    ).subscribe(product => {
      this.nypDataService.CurrentProduct$.next(product);
      if (product) {
        this.selectProduct(product);
        this.nypDataService.CurrentProduct$.next(product);
      }
    });

  }

  getCountries(): void {
    this.timProtezioneViaggiAnnualeApiService.getCountries().subscribe(
      countries => this.destinationWorld = countries.find(c => c.code == '1EUSAC')?.options,
      error => console.error('Error fetching countries:', error)
    );
  }

  decreasePassengersCount(): void { this.form.get('passengers').setValue(--this.selectedPassengersCount); this.aggiornaECalcola().subscribe(); }

  increasePassengersCount(): void { this.form.get('passengers').setValue(++this.selectedPassengersCount); this.aggiornaECalcola().subscribe();}

  getFieldInvalidError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field.invalid && (field.dirty || field.touched);
  }

  openModal() { this.modalService.open(MoreDetailsModalComponent, { size: "lg", windowClass: "tim-modal-window", }); }

  controlDate(event: [Date, Date]) { this.form.get('picker').setValue(event); }

  openInfoModal() {
    const modalRef = this.modalService.open(InfoDetailsModalComponent, { size: "lg", windowClass: "tim-modal-window", });
    modalRef.componentInstance.isEurope = this.isEurope;
    modalRef.componentInstance.isWorld = this.isWorld;
  }

  openLuggageModal() { this.modalService.open(InfoLuggageModalComponent, { size: "lg", windowClass: "tim-modal-window", }); }

  toggleCalendar() { this.showCalendar = !this.showCalendar; }

  changeDestination(destination: 'europe' | 'world'): void {
    if (destination === 'europe') {
      this.selectedProduct = this.nypDataService.Products$.value?.
        find(p => p.code == 'tim-protezione-viaggi-europe-y');
      this.updateSelectedProduct('tim-protezione-viaggi-europe-y');

      this.isEurope = true;
      this.isWorld = false;
    } else if (destination === 'world') {
      this.selectedProduct = this.nypDataService.Products$.value?.
        find(p => p.code == 'tim-protezione-viaggi-world-y');
      this.updateSelectedProduct('tim-protezione-viaggi-world-y');
      this.isEurope = false;
      this.isWorld = true;
    }

  }

  orderHasPrice(orderPrice: string): boolean{
    if(orderPrice && typeof orderPrice === 'string'){
      return parseFloat(orderPrice) > 0;
    } else if(typeof orderPrice === 'number'){
      return orderPrice > 0
    }
    return false;
  }

  next(currentProduct: RecursivePartial<IProduct>): void {
    this.kenticoTranslateService.getItem<any>('tim_protezione_viaggi').pipe(take(1)).subscribe(item => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + "Continua";
      digitalData.page.pageInfo.pageName = 'Login register';
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    });
    this.router.navigate(['/nyp-checkout/tim-protezione-viaggi-annuale/login-register'], { state: { selectedProduct: currentProduct } });
  }

  private aggiorna(): Observable<any> {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    endDate.setFullYear(startDate.getFullYear() + 1);

    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();

    const selectedDestinationNumber = this.form.value.destinazione;
    const selectedDestinationName: string = this.isEurope ? "Europa" : this.destinationWorld[selectedDestinationNumber];

    const insuredItems: ViaggiAnnualeInsuredItems = {
      insurance_holders: [],
      destination: selectedDestinationName,
      destinationCode: selectedDestinationNumber,
      insured_is_contractor: true,
      start_date: formattedStartDate,
      expiration_date: formattedEndDate,
      extra: this.form.value.extra,
      insureds_total: this.form.value.passengers,
    }

    const packet = this.selectedProduct?.packets?.[0];

    return this.timProtezioneViaggiAnnualeApiService.putOrder({
      chosenWarranties: packet?.warranties?.
        filter(warranty => !['EAB', 'EABT'].includes(warranty.anagWarranty?.internal_code?.toUpperCase()) || warranty.anagWarranty?.internal_code?.toUpperCase() == this.form.value.extra?.toUpperCase()).
        map(warranty => Object.assign(warranty, { startDate: this.nypDataService.Order$.value?.orderItem[0]?.start_date, endDate: this.nypDataService.Order$.value?.orderItem[0]?.expiration_date })),
      insuredItems: insuredItems,
      anagState: 'Draft',
      quantity: this.form.value.passengers,
      packet: { id: packet.id },
      productId: this.selectedProduct.id,
      start_date: this.nypDataService.Order$?.value?.orderItem[0]?.start_date,
    }).pipe(tap((response) => localStorage.setItem('product_code', response?.packet?.data?.product?.code)));
  }

  private aggiornaECalcola(): Observable<any> {
    if (!this.form.valid) return of(null);
    return this.aggiorna().pipe(
      switchMap(orderResponse => this.timProtezioneViaggiAnnualeApiService.quote({
        data: {
          customerId: this.nypDataService.Order$.value?.customerId,
          orderId: this.nypDataService.Order$.value.id,
          productId: this.selectedProduct.id
        }
      })
      ),
      switchMap(quoteResponse => this.timProtezioneViaggiAnnualeApiService.getOrder(this.nypDataService.OrderCode)),
    );
  }
}
