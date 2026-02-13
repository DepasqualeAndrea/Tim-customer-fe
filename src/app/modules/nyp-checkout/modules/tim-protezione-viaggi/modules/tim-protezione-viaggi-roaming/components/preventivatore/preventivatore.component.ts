import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "@services";
import {
  IProduct,
  RecursivePartial,
  Warranty,
} from "app/modules/nyp-checkout/models/api.model";
import { NypApiService } from "app/modules/nyp-checkout/services/api.service";
import { NypDataService } from "app/modules/nyp-checkout/services/nyp-data.service";
import { Observable, Subject, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { InfoDetailsModalComponent } from "../../modal/info-details-modal/info-details-modal.component";
import { MoreDetailsModalComponent } from "../../modal/more-details-modal/more-details-modal.component";
import { TimProtezioneViaggiRoamingApiService } from "../../services/api.service";
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from "app/core/services/adobe_analytics/adobe-init-datalayer.service";
import { NypIadDocumentaryService } from "@NYP/ngx-multitenant-core";

@Component({
    selector: "app-preventivatore",
    templateUrl: "./preventivatore.component.html",
    styleUrls: [
        "./preventivatore.component.scss",
        "../../../../../../styles/checkout-forms.scss",
        "../../../../../../styles/size.scss",
        "../../../../../../styles/colors.scss",
        "../../../../../../styles/text.scss",
        "../../../../../../styles/common.scss",
    ],
    standalone: false
})
export class PreventivatoreComponent implements OnInit, OnDestroy {
  @ViewChild("urlContainer") urlContainer!: ElementRef;
  @ViewChild("destinazione") destinazioneElement: ElementRef;

  public isMobile = window.innerWidth < 768;
  public isTablet = window.innerWidth < 992;

  form: UntypedFormGroup;
  isFormValid = false;
  showError = false;

  selectedProduct: RecursivePartial<IProduct>;
  selectedInsuredCount = 0;
  showInsuredSection = true;

  countries: { [key: string]: string } = {};
  filteredCountries: { key: string; value: string }[] = [];
  searchTerm = "";
  selectedCountry = "";
  isDropdownOpen = false;

  showCalendar = false;

  private destroy$ = new Subject<void>();
  private documentToDownload: string;
  private previousFormValue: any = null;
  private debounceTime = 250;

  public Products$ = this.nypDataService.Products$;
  public ViaggiRoamingProducts$ = this.nypDataService.Products$.pipe(
    map((p) =>
      p.filter((p) => p.code.includes("tim-protezione-viaggi-roaming"))
    )
  );

  isEAMWarranty(quote: any): boolean {
    const warranties = quote?.dataOrder?.data?.orderItem?.[0]?.instance?.chosenWarranties?.data?.warranties;
    return warranties && warranties.some(warranty => warranty?.anagWarranty?.internal_code === 'EAM');
  }

  getCeiling(quote: any): number {
    const warranties = quote?.dataOrder?.data?.orderItem?.[0]?.instance?.chosenWarranties?.data?.warranties;
    const eamWarranty = warranties?.find(warranty => warranty?.anagWarranty?.internal_code === 'EAM');
    return eamWarranty ? eamWarranty?.ceilings?.ceilings?.[0] : 0;
  }

  public warranties$: Observable<RecursivePartial<Warranty>[]> = this.ViaggiRoamingProducts$.pipe(map(p => p?.[0]?.packets?.[0]?.warranties));


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
    private timProtezioneViaggiRoamingApiService: TimProtezioneViaggiRoamingApiService,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private elementRef: ElementRef,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
    private nypIadDocumentaryService: NypIadDocumentaryService
  ) {
    document.addEventListener("click", this.onDocumentClick.bind(this));
  }
  ngOnInit(): void {
    this.nypDataService.redirectIfUndefinedProduct();
    this.kenticoTranslateService.getItem<any>('tim_protezione_viaggi').pipe(take(1)).subscribe(item => {
      const productName = item?.system?.name;
      let digitalData: digitalData = window["digitalData"];
      digitalData.page.category.primaryCategory = `${productName} roaming`;
      digitalData.page.pageInfo.pageName = "tim-protezione-viaggi-roaming preventivatore";
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    });
    this.nypDataService.CurrentProduct$.pipe(take(1)).subscribe(product => {
      this.documentToDownload = product?.informativeSet
    });
    this.nypDataService.reset();
    this.initializeForm();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.resetState();
    this.modalService.dismissAll();
    document.removeEventListener("click", this.onDocumentClick.bind(this));
  }

  private setupSubscriptions(): void {
    this.nypDataService.Products$.pipe(
      filter((products) => !!products),
      take(1),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadProducts(() => {
        this.configureOrderForProduct(this.selectedProduct, () => {
          this.loadCountriesForProduct(this.selectedProduct, (countries) => {
            this.countries = countries;
            this.filteredCountries = Object.entries(this.countries)
              .map(([key, value]) => ({ key, value }))
              .sort((a, b) => a.value.localeCompare(b.value));
          });
        });
      });
    });

    this.setupFormSubscription();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      destinazione: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      passengers: [
        this.selectedInsuredCount,
        [Validators.required,Validators.min(1), Validators.max(9)],
      ],
    });
  }

  private setupFormSubscription(): void {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        debounceTime(this.debounceTime),
        distinctUntilChanged((prev, curr) => {
          return this.areFormValuesEqual(prev, curr);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((currentValue) => {
        if (this.shouldUpdateCalculation(currentValue)) {
          this.previousFormValue = { ...currentValue };
          this.aggiornaECalcola().subscribe();
        }
      });

    this.form
      .get("destinazione")
      .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.selectedCountry = value;
      });
  }

  private areFormValuesEqual(prev: any, curr: any): boolean {
    if (!prev || !curr) return false;

    return (
      prev.destinazione === curr.destinazione &&
      prev.passengers === curr.passengers &&
      this.areDatesEqual(prev.startDate, curr.startDate) &&
      this.areDatesEqual(prev.endDate, curr.endDate)
    );
  }

  private areDatesEqual(date1: any, date2: any): boolean {
    if (!date1 || !date2) return false;

    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);

    return d1.getTime() === d2.getTime();
  }

  private shouldUpdateCalculation(currentValue: any): boolean {
    if (!this.previousFormValue) return true;

    const hasDestinationChanged = currentValue.destinazione !== this.previousFormValue.destinazione;
    const hasPassengersChanged = currentValue.passengers !== this.previousFormValue.passengers;
    const hasStartDateChanged = !this.areDatesEqual(currentValue.startDate, this.previousFormValue.startDate);
    const hasEndDateChanged = !this.areDatesEqual(currentValue.endDate, this.previousFormValue.endDate);

    if (currentValue.passengers === 1) {
      return true;
    }

    return hasDestinationChanged || hasPassengersChanged || hasStartDateChanged || hasEndDateChanged;
  }

  private loadProducts(callback: () => void): void {
    this.ViaggiRoamingProducts$.pipe(
      take(1),
      map((products) => {
        const roamingProduct = products.find(
          (p) => p.code === "tim-protezione-viaggi-roaming"
        );
        if (roamingProduct) {
          this.selectedProduct = roamingProduct;
        }
      })
    ).subscribe(() => {
      callback();
    });
  }

  private configureOrderForProduct(
    product: RecursivePartial<IProduct>,
    callback: () => void
  ): void {
    this.apiService
      .postOrder({
        customerId: this.authService.loggedUser?.id,
        packetId: product.packets?.[0]?.id,
        productId: product.id,
      })
      .pipe(
        tap((order) => {
          if (order && order.orderCode) {
            this.nypDataService.Order$.next(order);
            this.nypDataService.OrderCode = order.orderCode;
          }
        })
      )
      .subscribe(
        () => {
          callback();
        },
        (error) => {
          console.error("Error configuring order:", error);
        }
      );
  }

  private loadCountriesForProduct(
    product: RecursivePartial<IProduct>,
    callback: (countries: { [key: string]: string }) => void
  ): void {
    this.timProtezioneViaggiRoamingApiService.getCountries().subscribe(
      (countries: string[]) => {
        const countryMap = countries.reduce((acc, country) => {
          acc[country] = country;
          return acc;
        }, {} as { [key: string]: string });
        callback(countryMap);
      },
      (error) => {
        console.error("Error loading countries:", error);
      }
    );
  }
  getCountries(orderCode: string): void {
    if (!orderCode) return;

    this.timProtezioneViaggiRoamingApiService
      .getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (countries: string[]) => {
          this.countries = countries.reduce(
            (acc, country) => ({
              ...acc,
              [country]: country,
            }),
            {}
          );
          this.resetFilteredCountries();
        },
        (error) => console.error("Error fetching countries:", error)
      );
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
      );
  }

  resetFilteredCountries(): void {
    this.filteredCountries = Object.entries(this.countries)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }

  selectCountry(countryKey: string): void {
    const selectedCountry = Object.entries(this.countries).find(
      ([key]) => key === countryKey
    );
    if (selectedCountry) {
      this.selectedCountry = selectedCountry[1];
      this.form.get("destinazione").setValue(selectedCountry[0]);
      this.isDropdownOpen = false;
      this.searchTerm = "";
      this.filterCountries();
    }
  }

  decreaseInsuredCount(): void {
    if (this.selectedInsuredCount > 1) {
      this.selectedInsuredCount--;
      this.form.get("passengers").setValue(this.selectedInsuredCount);
      this.isValid();
    }
  }

  increaseInsuredCount(): void {
    if (this.selectedInsuredCount <= 9) {
      this.selectedInsuredCount++;
      this.form.get("passengers").setValue(this.selectedInsuredCount);
      this.isValid();
    }
  }

  onStartDateSelected(date: Date): void {
    this.form.get("startDate").setValue(date);
    this.isValid();
  }

  onEndDateSelected(date: Date): void {
    this.form.get("endDate").setValue(date);
    this.isValid();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      setTimeout(() => {
        const input = this.elementRef.nativeElement.querySelector("input");
        if (input) input.focus();
      });
    }
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  openModal(): void {
    this.modalService.open(MoreDetailsModalComponent, {
      size: "lg",
      windowClass: "tim-modal-window",
    });
  }

  openInfoModal(): void {
    this.modalService.open(InfoDetailsModalComponent, {
      size: "lg",
      windowClass: "tim-modal-window",
    });
  }

  openLinkInNewTab(): void {
    const link = this.urlContainer.nativeElement.querySelector("a")?.href;
    if (link) window.open(link, "_blank");
  }

  downloadProductDocuments() {
    this.nypIadDocumentaryService.downloadFileFromUrl({ filename: this.documentToDownload?.split('/')?.pop(), remoteUrl: this.documentToDownload })
      .pipe(
        map(r => ({ content: r, filename: this.documentToDownload?.split('/')?.pop(), }))
      )
      .subscribe(b => saveAs(b.content, b.filename));
  }

  next(currentProduct: RecursivePartial<IProduct>): void {
    this.kenticoTranslateService.getItem<any>('tim_protezione_viaggi').pipe(take(1)).subscribe(item => {
      let digitalData: digitalData = window['digitalData'];
      digitalData.cart.form.button_name = "PROCEDI";
      digitalData.page.pageInfo.pageName = `LoginPage`;
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    });
    this.restartOrder().subscribe(() => {
      const startDate = this.form.value.startDate;
      const endDate = this.form.value.endDate;
      const startDatePlusOne = new Date(startDate);
      const endDatePlusOne = new Date(endDate);
      startDatePlusOne.setDate(startDatePlusOne.getDate() + 1);
      endDatePlusOne.setDate(endDatePlusOne.getDate());

      this.router.navigate(
        ["/nyp-checkout/tim-protezione-viaggi-roaming/login-register"],
        { state: { selectedProduct: currentProduct } }
      );
    });
  }

  private restartOrder(): Observable<any> {
    if (!this.selectedProduct) {
      console.error("No product selected");
      return of(null);
    }

    return this.apiService
      .postOrder({
        customerId: this.authService.loggedUser?.id,
        packetId:
          this.selectedProduct.packets?.find((p) => p.preselected)?.id ??
          this.selectedProduct.packets?.[0]?.id,
        productId: this.selectedProduct.id,
      })
      .pipe(
        tap((order) => {
          if (order && order.orderCode) {
            this.nypDataService.Order$.next(order);
            this.nypDataService.OrderCode = order.orderCode;
            this.getCountries(order.orderCode);
          }
        }),
        switchMap((order) => {
          if (this.form.valid && order) {
            return this.aggiornaECalcola();
          }
          return of(order);
        })
      );
  }

  private aggiorna(): Observable<any> {
    const startDate = this.form.value.startDate;
    const endDate = this.form.value.endDate;
    const startDatePlusOne = new Date(startDate);
    const endDatePlusOne = new Date(endDate);
    startDatePlusOne.setDate(startDatePlusOne.getDate() + 1);
    endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
    const packet = this.selectedProduct?.packets?.[0];

    const selectedDestinationNumber = this.form.value.destinazione;
    const selectedDestinationName = this.form.value.destinazione;

    return this.timProtezioneViaggiRoamingApiService
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
          destination: selectedDestinationName,
          destinationCode: selectedDestinationNumber,
          insured_is_contractor: false,
          start_date: startDatePlusOne.toISOString(),
          expiration_date: endDatePlusOne.toISOString(),
          insureds_total: this.form.value.passengers,
        },
        anagState: "Draft",
        quantity: this.form.value.passengers,
        start_date: startDatePlusOne.toISOString(),
        days:
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 3600 * 24)
          ),
      })
      .pipe(
        tap((response) =>
          localStorage.setItem(
            "product_code",
            response?.packet?.data?.product?.code
          )
        )
      );
  }

  private aggiornaECalcola(): Observable<any> {
    if (!this.form.valid || this.selectedInsuredCount <= 0 ) {
      return of(null);
    }
    return this.aggiorna().pipe(
      switchMap((orderResponse) =>
        this.timProtezioneViaggiRoamingApiService.quote({
          data: {
            customerId: this.nypDataService.Order$.value?.customerId,
            orderId: this.nypDataService.Order$.value.id,
            productId: this.selectedProduct.id,
          },
        })
      ),
      switchMap((quoteResponse) =>
        this.timProtezioneViaggiRoamingApiService.getOrder(
          this.nypDataService.OrderCode
        )
      )
    );
  }

  isValid(): void {
    this.isFormValid = this.form.valid;
  }

  getFieldInvalidError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field?.invalid && (field?.dirty || field?.touched || this.showError);
  }

  showErrorRange(errorRange: boolean): void {
    this.showError = errorRange;
    if (errorRange) this.isFormValid = false;
  }

  private resetState(): void {
    this.selectedProduct = null;
    this.selectedInsuredCount = 1;
    this.showCalendar = false;
    this.showError = false;
    this.isFormValid = false;
    this.searchTerm = "";
    this.selectedCountry = null;
    this.isDropdownOpen = false;
    this.countries = {};
    this.filteredCountries = [];
    if (this.form) this.form.reset();
  }

  private onDocumentClick(event: MouseEvent): void {
    if (
      this.destinazioneElement &&
      !this.destinazioneElement.nativeElement.contains(event.target)
    ) {
      this.isDropdownOpen = false;
    }
  }
}
