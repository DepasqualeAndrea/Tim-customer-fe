import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "@services";
import {
  IProduct,
  RecursivePartial,
} from "app/modules/nyp-checkout/models/api.model";
import { NypApiService } from "app/modules/nyp-checkout/services/api.service";
import { NypDataService } from "app/modules/nyp-checkout/services/nyp-data.service";
import { Observable, of } from "rxjs";
import { catchError, filter, map, switchMap, take, tap } from "rxjs/operators";
import { InfoDetailsModalComponent } from "../../modal/info-details-modal/info-details-modal.component";
import { MoreDetailsModalComponent } from "../../modal/more-details-modal/more-details-modal.component";
import { TimProtezioneViaggiBreveApiService } from "../../services/api.service";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";
import { AdobeAnalyticsDatalayerService } from "app/core/services/adobe_analytics/adobe-init-datalayer.service";
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';

@Component({
  selector: "app-preventivatore",
  templateUrl: "./preventivatore.component.html",
  styleUrls: [
    "./preventivatore.component.scss",
    "../../../../../../styles/size.scss",
    "../../../../../../styles/colors.scss",
    "../../../../../../styles/text.scss",
    "../../../../../../styles/common.scss",
    "../../../../../../styles/checkout-forms.scss",
  ],
})
export class PreventivatoreComponent implements OnInit, OnDestroy {
  selectedProduct: RecursivePartial<IProduct>;
  selectedPassengersCount: number = 0;

  selectedInsuredCount: number = 1;
  selectedPassengersCountUnder: number = 0;
  selectedPassengersCountOver: number = 0;
  passengersCount: boolean;
  showDaysSection: boolean = true;
  form: FormGroup;
  showCalendar: boolean = false;
  showError: boolean = false;
  isFormValid: boolean;
  days: number = 1;
  public price: number = 0;
  public maxRetries: number = 3;
  private currentRetry: number = 0;
  public startQuotation: boolean = false;
  private hasRealChanges: boolean = false;
  private updateTimeout: any = null;
  private previousValidDate: [Date, Date] | null = null;
  private isInitialLoad: boolean = true;
  private passengerChangeTimeout: any;
  private europeCountryIndices: Set<string> = new Set();
  private worldCountryIndices: Set<string> = new Set();
  private europeProduct: RecursivePartial<IProduct>;
  private worldProduct: RecursivePartial<IProduct>;
  private europeCountries: { [key: string]: string } = {};
  private worldCountries: { [key: string]: string } = {};
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];

  countries: { [key: string]: string } = {};
  currentDestinationOptions: { [key: string]: string } | string[] =
    this.countries;
  filteredCountries: { key: string; value: string }[] = [];

  isDropdownOpen: boolean = false;
  searchTerm: string = "";
  selectedCountry: string | null = null;

  public isMobile: boolean = window.innerWidth < 768;
  public isTablet: boolean = window.innerWidth < 992;
  @HostListener("window:resize", ["$event"])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
    this.isTablet = event.target.innerWidth < 992;
  }
  @HostListener("document:click", ["$event"])
  closeDropdown(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest(".dropdown")) {
      this.isDropdownOpen = false;
      this.form.get("destinazione").markAsTouched();
      this.form.get("destinazione").updateValueAndValidity();
    }
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private apiService: NypApiService,
    private authService: AuthService,
    private nypDataService: NypDataService,
    private timProtezioneViaggiBreveApiService: TimProtezioneViaggiBreveApiService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.nypDataService.redirectIfUndefinedProduct();
    this.nypDataService.reset();
    this.initializeForm();
    this.setupSubscriptions();
  }
  private initializeForm(): void {
    this.form = this.formBuilder.group(
      {
        destinazione: ["", Validators.required],
        picker: ["", [Validators.required]],
        passengersUnder: [this.selectedPassengersCountUnder],
        passengersOver: [this.selectedPassengersCountOver],
      },
      { validators: this.passengersCounterValidator }
    );
  }

  private setupSubscriptions(): void {
    this.nypDataService.Products$.pipe(
      filter((products) => !!products),
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadProducts(() => {
        this.configureOrderForProduct(this.europeProduct, () => {
          this.loadCountriesForProduct(
            this.europeProduct,
            (europeCountries) => {
              this.europeCountries = europeCountries;
              this.countries = { ...this.countries, ...europeCountries };
              this.europeCountryIndices = new Set(Object.keys(europeCountries));

              this.selectProduct(this.worldProduct);

              this.configureOrderForProduct(this.worldProduct, () => {
                this.loadCountriesForProduct(
                  this.worldProduct,
                  (worldCountries) => {
                    this.worldCountries = worldCountries;
                    this.countries = { ...this.countries, ...worldCountries };
                    this.worldCountryIndices = new Set(
                      Object.keys(worldCountries)
                    );
                    this.kenticoTranslateService.getItem<any>('tim_protezione_viaggi').pipe(take(1)).subscribe(item => {
                      const productName = item?.system?.name;
                      let digitalData: digitalData = window["digitalData"];
                      digitalData.page.category.primaryCategory = `${productName} breve`;
                      digitalData.page.pageInfo.pageName = 'Preventivatore';
                      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
                    });
                  }
                );
              });
            }
          );
        });
      });
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.form.valid && this.hasValidInputs()) {
        this.debouncedRefreshAndCalculate();
      }
    });

    this.isValid();
    this.filteredCountries = [];
    this.resetFilteredCountries();
    this.passengersCount = false;
  }

  orderHasPrice(orderPrice: string | number): boolean {
    if (orderPrice === undefined || orderPrice === null) {
      return false;
    }
    let numericPrice: number;
    if (typeof orderPrice === 'string') {

      numericPrice = parseFloat(orderPrice);
    } else {
      numericPrice = orderPrice;
    }

    return !isNaN(numericPrice) && numericPrice > 0;
  }

  private configureOrderForProduct(
    product: RecursivePartial<IProduct>,
    callback: () => void
  ): void {
    this.apiService
      .postOrder({
        customerId: this.authService.loggedUser?.id,
        packetId:
          product.packets?.find((p) => p.preselected)?.id ??
          product.packets?.[0]?.id,
        productId: product.id,
      })
      .pipe(
        tap((order) => {
          this.nypDataService.Order$.next(order);
          this.nypDataService.OrderCode = order.orderCode;
        })
      )
      .subscribe(
        () => {
          callback();
        },
        (error) => {
          console.error(
            `Errore durante la configurazione dell'ordine per il prodotto ${product.code}:`,
            error
          );
        }
      );
  }

  private loadProducts(callback: () => void): void {
    this.nypDataService.Products$.pipe(
      map((products) => {
        this.europeProduct = products.find(
          (p) => p.code === "tim-protezione-viaggi-europe"
        );
        this.worldProduct = products.find(
          (p) => p.code === "tim-protezione-viaggi-world"
        );

        if (!this.europeProduct || !this.worldProduct) {
          throw new Error("Prodotti richiesti non trovati");
        }
      })
    ).subscribe(() => {
      callback();
    });
  }

  private loadCountriesForProduct(
    product: RecursivePartial<IProduct>,
    callback: (countries: { [key: string]: string }) => void
  ): void {
    this.timProtezioneViaggiBreveApiService
      .getCountries()
      .pipe(
        map(
          (response) => response.find((c) => c.code === "1DEST")?.options || {}
        )
      )
      .subscribe(
        (countries) => {
          callback(countries);
        },
        (error) => {
          console.error(
            "Errore durante il caricamento delle countries per il prodotto:",
            product,
            error
          );
        }
      );
  }

  private refreshDataAndRecalculate(): void {
    const totalPassengers = this.selectedPassengersCountUnder + this.selectedPassengersCountOver;

    if (totalPassengers === 0) {

      const currentOrder = this.nypDataService.Order$.value;
      if (currentOrder && currentOrder.orderItem && currentOrder.orderItem[0]) {
        currentOrder.orderItem[0].price = "0.0";
        this.nypDataService.Order$.next({ ...currentOrder });
      }
      this.hasRealChanges = false;
      return;
    }

    this.aggiorna()
      .pipe(
        switchMap(() => this.aggiornaECalcola()),
        catchError((error) => {
          console.error("Error during quote calculation:", error);
          return of(null);
        })
      )
      .subscribe(() => {
        this.hasRealChanges = false; // Resetta hasRealChanges dopo il calcolo
      });
  }

  selectCountry(countryKey: string): void {
    this.hasRealChanges = true;
    this.selectedCountry = countryKey;
    this.isDropdownOpen = false;

    const destinazioneControl = this.form.get("destinazione");
    destinazioneControl.setValue(countryKey);
    destinazioneControl.markAsTouched();
    destinazioneControl.markAsDirty();

    const product = this.europeCountryIndices.has(countryKey)
      ? this.europeProduct
      : this.worldCountryIndices.has(countryKey)
        ? this.worldProduct
        : null;

    if (!product) {
      console.warn(
        `Il paese selezionato (${countryKey}) non appartiene a nessun prodotto.`
      );
      return;
    }

    this.nypDataService.CurrentProduct$.next(product);
    if (this.selectedProduct?.id !== product.id) {
      this.selectedProduct = product;
      this.nypDataService.CurrentProduct$.next(product);
    }

    if (this.form.valid && this.hasValidInputs()) {
      this.debouncedRefreshAndCalculate();
    }
  }

  filterCountries(): void {
    if (!this.searchTerm) {
      this.resetFilteredCountries();
      return;
    }

    this.filteredCountries = Object.entries(this.countries)
      .map(([key, value]) => ({ key, value }))
      .filter((country) =>
        country.value.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) => a.value.localeCompare(b.value));
  }

  resetFilteredCountries(): void {
    this.filteredCountries = Object.entries(this.countries)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }

  selectProduct(product: RecursivePartial<IProduct>): void {
    this.selectedProduct = product;
    this.resetCounts();
    this.afterSelectProductCountries();
    this.selectedPassengersCount = 0;
    this.form.get("passengersUnder").setValue(this.selectedPassengersCount);
    this.form.get("passengersOver").setValue(this.selectedPassengersCount);
    this.form.get("picker").setValue("01/01/2024");
  }

  afterSelectProductCountries() {
    this.aggiorna().subscribe();
  }

  private hasValidInputs(): boolean {
    const formValues = this.form.value;
    const hasValidPassengers =
      (formValues.passengersUnder || 0) + (formValues.passengersOver || 0) >
      0 &&
      (formValues.passengersUnder || 0) + (formValues.passengersOver || 0) <= 9;
    const hasValidDates = this.isPickerValid();
    const hasValidDestination = !!formValues.destinazione;

    return hasValidPassengers && hasValidDates && hasValidDestination;
  }

  private debouncedRefreshAndCalculate(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    const totalPassengers = this.selectedPassengersCountUnder + this.selectedPassengersCountOver;
    if (totalPassengers === 0 || this.hasRealChanges) {
      this.updateTimeout = setTimeout(() => {
        this.refreshDataAndRecalculate();
      }, 250);
    }
  }

  passengersCounterValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    return control.get("passengersUnder")?.value +
      control.get("passengersOver")?.value <
      1 ||
      control.get("passengersUnder")?.value +
      control.get("passengersOver")?.value >
      9
      ? { passengersSumError: true }
      : null;
  }

  public incrementUnder() {
    this.hasRealChanges = true;
    this.form
      .get("passengersUnder")
      .setValue(++this.selectedPassengersCountUnder);

    this.debouncedRefreshAndCalculate();
  }

  public decrementUnder() {
    this.hasRealChanges = true;
    this.form
      .get("passengersUnder")
      .setValue(--this.selectedPassengersCountUnder);

    this.debouncedRefreshAndCalculate();
  }

  public incrementOver() {
    this.hasRealChanges = true;
    this.form
      .get("passengersOver")
      .setValue(++this.selectedPassengersCountOver);

    this.debouncedRefreshAndCalculate();
  }

  public decrementOver() {
    this.hasRealChanges = true;
    this.form
      .get("passengersOver")
      .setValue(--this.selectedPassengersCountOver);

    this.debouncedRefreshAndCalculate();
  }

  openModal() {
    const modalRef = this.modalService.open(MoreDetailsModalComponent, {
      size: "lg",
      windowClass: "tim-modal-window",
    });
  }

  openInfoModal() {
    const modalRef = this.modalService.open(InfoDetailsModalComponent, {
      size: "lg",
      windowClass: "tim-modal-window",
    });
  }

  toggleCalendar(event: MouseEvent): void {
    event.stopPropagation();
    this.showCalendar = !this.showCalendar;
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest("picker")) {
      this.isDropdownOpen = false;
      this.form.get("picker").markAsTouched();
      this.form.get("destinazione").updateValueAndValidity();
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.searchTerm = "";
      this.resetFilteredCountries();
    } else {
      this.form.get("destinazione").markAsTouched();
      this.form.get("destinazione").updateValueAndValidity();
    }
  }

  getFieldInvalidError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched || this.showError);
  }

  controlDate(event: [Date, Date]) {
    this.isInitialLoad = false;
    this.hasRealChanges = true;
    const [startDate, endDate] = event;

    if (startDate && endDate) {
      this.days =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        ) + 1;

      const totalDays = this.days;
      this.showError = totalDays > 60;

      if (this.showError) {
        this.form.get("picker").setValue(null);
        this.days = 0;
      } else {
        this.form.get("picker").setValue(event);
        if (this.form.valid && this.hasValidInputs()) {
          this.debouncedRefreshAndCalculate();
        }
      }
    } else {
      this.showError = true;
    }

    this.startQuotation = true;
  }

  isPickerValid(): boolean {
    const pickerValue = this.form.get("picker").value;
    if (!pickerValue) return false;

    const [startDate, endDate] = pickerValue;
    if (!startDate || !endDate) return false;

    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      return false;
    }

    const days =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      ) + 1;
    return days <= 60;
  }

  isValid() {
    if (this.form.valid) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    }
  }

  showErrorRange(errorRange: boolean) {
    this.showError = errorRange;

    if (errorRange) {
      this.isFormValid = false;
    }
  }

  next(currentProduct: RecursivePartial<IProduct>): void {
    this.kenticoTranslateService.getItem<any>('tim_protezione_viaggi').pipe(take(1)).subscribe(item => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + "Continua";
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
    });
    if (this.selectedProduct?.id !== currentProduct.id) {
      this.configureOrderForProduct(currentProduct, () => {
        this.loadCountriesForProduct(currentProduct, (countries) => {
          if (currentProduct.code === "tim-protezione-viaggi-europe") {
            this.europeCountries = countries;
            this.europeCountryIndices = new Set(Object.keys(countries));
          } else if (currentProduct.code === "tim-protezione-viaggi-world") {
            this.worldCountries = countries;
            this.worldCountryIndices = new Set(Object.keys(countries));
          }

          this.countries = { ...this.europeCountries, ...this.worldCountries };
          this.selectedProduct = currentProduct;
          this.router.navigate(
            ["/nyp-checkout/tim-protezione-viaggi-breve/login-register"],
            { state: { selectedProduct: currentProduct } }
          );
        });
      });
    } else {
      this.router.navigate(
        ["/nyp-checkout/tim-protezione-viaggi-breve/login-register"],
        { state: { selectedProduct: currentProduct } }
      );
    }
  }

  private aggiorna(): Observable<any> {
    const pickerValue = this.form.value.picker;
    let startDatePlusOne: Date;
    let endDatePlusOne: Date;

    const [startDate, endDate] = pickerValue;
    startDatePlusOne = startDate ? new Date(startDate) : new Date();
    endDatePlusOne = endDate ? new Date(endDate) : new Date();
    startDatePlusOne.setDate(startDatePlusOne.getDate() + 1);
    endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);

    const quantity =
      this.selectedPassengersCountUnder + this.selectedPassengersCountOver;
    const packet = this.selectedProduct?.packets?.[0];

    const selectedDestinationNumber = this.form.value.destinazione;
    const selectedDestinationName = this.countries[selectedDestinationNumber];

    return this.timProtezioneViaggiBreveApiService
      .putOrder({
        chosenWarranties: packet?.warranties?.map((warranty) =>
          Object.assign(warranty, {
            startDate:
              this.nypDataService.Order$.value?.orderItem[0]?.start_date,
            endDate:
              this.nypDataService.Order$.value?.orderItem[0]?.expiration_date,
          })
        ),
        insuredItems: {
          insurance_holders: [],
          destination: selectedDestinationName as any,
          destinationCode: selectedDestinationNumber,
          insured_is_contractor: true,
          start_date: startDatePlusOne.toISOString(),
          overSeventy: this.form.value.passengersOver,
          underSeventy: this.form.value.passengersUnder,
          expiration_date: endDatePlusOne.toISOString(),
          insureds_total: quantity,
        },
        start_date: startDatePlusOne.toISOString(),
        anagState: "Draft",
        quantity: quantity,
        days: this.days,
        packet: { id: packet.id },
        productId: this.selectedProduct.id,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(
            "product_code",
            response?.packet?.data?.product?.code
          );
        })
      );
  }

  private aggiornaECalcola(): Observable<any> {
    if (!this.form.valid) {
      return of(null);
    }

    const totalPassengers = this.selectedPassengersCountUnder + this.selectedPassengersCountOver;
    if (totalPassengers === 0) {
      const currentOrder = this.nypDataService.Order$.value;
      if (currentOrder && currentOrder.orderItem && currentOrder.orderItem[0]) {
        currentOrder.orderItem[0].price = "0.0";
      }
      return of(currentOrder);
    }

    return this.aggiorna().pipe(
      switchMap((orderResponse) => {
        return this.timProtezioneViaggiBreveApiService.quote({
          data: {
            customerId: this.nypDataService.Order$.value?.customerId,
            orderId: this.nypDataService.Order$.value.id,
            productId: this.selectedProduct.id,
          },
        });
      }),
      switchMap((quoteResponse) => {
        return this.timProtezioneViaggiBreveApiService.getOrder(
          this.nypDataService.OrderCode
        );
      }),
      switchMap((order) => {
        if (order?.orderItem?.[0]?.price === "0.0") {
          return new Observable((subscriber) => {
            setTimeout(() => {
              this.aggiorna()
                .pipe(
                  switchMap(() =>
                    this.timProtezioneViaggiBreveApiService.quote({
                      data: {
                        customerId:
                          this.nypDataService.Order$.value?.customerId,
                        orderId: this.nypDataService.Order$.value.id,
                        productId: this.selectedProduct.id,
                      },
                    })
                  ),
                  switchMap(() =>
                    this.timProtezioneViaggiBreveApiService.getOrder(
                      this.nypDataService.OrderCode
                    )
                  )
                )
                .subscribe({
                  next: (updatedOrder) => {
                    subscriber.next(updatedOrder);
                    subscriber.complete();
                    let digitalData: digitalData = window['digitalData'];
                    digitalData.cart.item[0].price = updatedOrder?.orderItem?.[0]?.price;
                    digitalData.cart.price.cartTotal = updatedOrder?.orderItem?.[0]?.price;
                    digitalData.cart.form.button_name = `quotazione_${updatedOrder?.orderItem?.[0]?.insured_item?.destination}_${updatedOrder?.orderItem?.[0]?.insured_item?.start_date}_${updatedOrder?.orderItem?.[0]?.insured_item?.expiration_date}`;
                    this.adobeAnalyticsDataLayerService.adobeTrackClick();
                  },
                  error: (err) => subscriber.error(err),
                });
            }, 300);
          });
        }
        return of(order);
      }),
      catchError((error) => {
        console.error("Error during quote calculation:", error);
        return of(null);
      })
    );
  }

  public isAcquistaEnabled(): boolean {
    const order = this.nypDataService.Order$.value;
    const price = order?.orderItem?.[0]?.price;

    return (
      this.form.valid &&
      this.isPickerValid() &&
      !this.showError &&
      !!price &&
      price !== "0.0" &&
      price !== "0"
    );
  }

  private resetCounts() { }

  private resetState(): void {
    this.selectedProduct = null;
    this.selectedPassengersCount = 0;
    this.selectedInsuredCount = 1;
    this.selectedPassengersCountUnder = 0;
    this.selectedPassengersCountOver = 0;
    this.passengersCount = false;
    this.showDaysSection = true;
    this.showCalendar = false;
    this.showError = false;
    this.isFormValid = false;
    this.days = 1;
    this.startQuotation = false;
    this.hasRealChanges = false;
    this.isInitialLoad = true;
    this.searchTerm = "";
    this.selectedCountry = null;
    this.isDropdownOpen = false;

    this.europeCountryIndices.clear();
    this.worldCountryIndices.clear();
    this.europeCountries = {};
    this.worldCountries = {};
    this.countries = {};
    this.filteredCountries = [];

    if (this.form) {
      this.form.reset();
    }

    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
    if (this.passengerChangeTimeout) {
      clearTimeout(this.passengerChangeTimeout);
      this.passengerChangeTimeout = null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    this.resetState();

    this.modalService.dismissAll();
  }
}
