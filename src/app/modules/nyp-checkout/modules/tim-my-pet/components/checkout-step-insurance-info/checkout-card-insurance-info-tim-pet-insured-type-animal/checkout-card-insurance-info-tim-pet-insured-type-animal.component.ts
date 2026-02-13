import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { TimeHelper } from "app/shared/helpers/time.helper";
import moment from "moment";
import {
  CheckoutStepInsuranceInfoMiFidoProduct,
  PetInfo,
} from "app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-mi-fido/checkout-step-insurance-info-mi-fido.model";
import { AdobeAnalyticsDatalayerService } from "app/core/services/adobe_analytics/adobe-init-datalayer.service";
import { digitalData } from "app/core/services/adobe_analytics/adobe-analytics-data.model";
import { DataService } from "@services";
import { TimMyPetCheckoutService } from "../../../services/checkout.service";
import { NypDataService } from "../../../../../services/nyp-data.service";

import { distinctUntilChanged, take } from 'rxjs/operators';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: "app-checkout-card-insurance-info-tim-pet-insured-type-animal",
    templateUrl: "./checkout-card-insurance-info-tim-pet-insured-type-animal.component.html",
    styleUrls: [
        "./checkout-card-insurance-info-tim-pet-insured-type-animal.component.scss",
        "../../../../../styles/checkout-forms.scss",
        "../../../../../styles/size.scss",
        "../../../../../styles/colors.scss",
        "../../../../../styles/text.scss",
        "../../../../../styles/common.scss",
    ],
    standalone: false
})
export class CheckoutCardInsuranceInfoTimPetInsuredTypeAnimalComponent
  implements OnInit
{
  @Input() product: CheckoutStepInsuranceInfoMiFidoProduct;
  @Input() kenticoItem: any;
  @Output() operation: EventEmitter<string> = new EventEmitter<string>();
  @Output() nextStep: EventEmitter<UntypedFormGroup> = new EventEmitter<UntypedFormGroup>();
  @Output() formUpdated: EventEmitter<UntypedFormGroup> =
    new EventEmitter<UntypedFormGroup>();
  @Input() minDateAnimals: NgbDateStruct;
  @Input() maxDateAnimals: NgbDateStruct;
  @Output() petKindData = new EventEmitter<string>();

  form: UntypedFormGroup;
  petKind: string;
  maxBirthDate: NgbDateStruct;
  minBirthDate: NgbDateStruct;
  formSubmitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dataService: DataService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private checkoutService: TimMyPetCheckoutService,
    private nypDataService: NypDataService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  ngOnInit() {
    this.minBirthDate = TimeHelper.fromDateToNgbDate(
      moment().subtract(9, "y").add(1, "day").toDate()
    );
    this.maxBirthDate = TimeHelper.fromDateToNgbDate(
      moment().subtract(181, "day").toDate()
    );

    this.form = this.formBuilder.group({
      petName: [null, [Validators.required, Validators.maxLength(15)]],
      kind: [null , [Validators.required, Validators.pattern(/^(dog|cat)$/)]],
      birthDate: [null, Validators.required],
      microChip: [
        null,
        [
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(15),
          Validators.maxLength(15),
        ],
      ],
    });

    this.form.setValidators(this.dateRangeValidator.bind(this));

    this.form.valueChanges
    .pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)))
    .subscribe((changes) => {
      if (changes.kind) {
        this.selectPetType(changes.kind);
      }
      this.formUpdated.emit(this.form);
    });
  }

  dateRangeValidator(formGroup: UntypedFormGroup) {
    const birthDateControl = formGroup.get("birthDate");

    if (!birthDateControl || !birthDateControl.value) {
      return null;
    }

    const birthDate = birthDateControl.value;

    if (typeof birthDate !== "object" && !this.isValidDate(birthDate)) {
      return {
        notCompliant: "customers_tim_pet.insurance_info_age_min_max_mp",
      };
    }

    const minDate = TimeHelper.fromNgbDateToDate(
      new NgbDate(
        this.minBirthDate.year,
        this.minBirthDate.month,
        this.minBirthDate.day
      )
    );
    const maxDate = TimeHelper.fromNgbDateToDate(
      new NgbDate(
        this.maxBirthDate.year,
        this.maxBirthDate.month,
        this.maxBirthDate.day
      )
    );
    let selectedDate;

    if (typeof birthDate === "object") {
      selectedDate = TimeHelper.fromNgbDateToDate(birthDate);
    } else {
      selectedDate = new Date(birthDate);
    }

    if (selectedDate < minDate || selectedDate > maxDate) {
      return {
        notCompliant: "customers_tim_pet.insurance_info_age_min_max_mp",
      };
    }

    return null;
  }

  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  selectPetType(type: string): void {
    this.petKind = type === "dog" ? "Cane" : type === "cat" ? "Gatto" : "";

    this.form.get("kind").setValue(type, { emitEvent: false });

    if (type === "dog") {
      this.form
        .get("microChip")
        .setValidators([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(15),
          Validators.maxLength(15),
        ]);
    } else if (type === "cat") {
      this.form.get("microChip").clearValidators();
      this.form
        .get("microChip")
        .setValidators([
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(15),
          Validators.maxLength(15),
        ]);
    } else {
      this.form.get("microChip").clearValidators();
      this.form
        .get("microChip")
        .setValidators([
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(15),
          Validators.maxLength(15),
        ]);
    }

    this.form.get("microChip").updateValueAndValidity();
  }

  getFieldInvalidError(formControlName: string): boolean {
    const control = this.form.get(formControlName);
    if (!control) return false;

    return (
      control.invalid &&
      (control.touched || control.dirty || this.formSubmitted)
    );
  }

  hasSpecificError(formControlName: string, errorType: string): boolean {
    const control = this.form.get(formControlName);
    if (!control) return false;

    return (
      control.hasError(errorType) &&
      (control.touched || control.dirty || this.formSubmitted)
    );
  }

  hasFormatError(formControlName: string): boolean {
    const control = this.form.get(formControlName);
    if (!control) return false;

    return (
      control.invalid &&
      !control.hasError("required") &&
      (control.touched || control.dirty || this.formSubmitted)
    );
  }

  getErrorFieldClass(formControlName: string): string {
    const control = this.form.get(formControlName);
    if (!control) return "";
    if (
      control.invalid &&
      (control.touched || control.dirty || this.formSubmitted)
    ) {
      if (
        !control.errors?.required &&
        (control.errors?.pattern ||
          control.errors?.minlength ||
          control.errors?.maxlength)
      ) {
        return "warning-field";
      }

      return "error-field";
    }

    return "";
  }

  isRequiredError(formControlName: string): boolean {
    const control = this.form.get(formControlName);
    if (!control) return false;

    return (
      control.hasError("required") &&
      (control.touched || control.dirty || this.formSubmitted)
    );
  }

  isFormatError(formControlName: string): boolean {
    const control = this.form.get(formControlName);
    if (!control) return false;

    const hasFormatError =
      control.hasError("pattern") ||
      control.hasError("minlength") ||
      control.hasError("maxlength");

    return (
      hasFormatError && (control.touched || control.dirty || this.formSubmitted)
    );
  }

  continue() {
    this.formSubmitted = true;

    if (this.form.valid) {
      let digitalData: digitalData = window["digitalData"];
      digitalData.cart.form.mypet_pet_type = this.petKind.toLowerCase();
      digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '');
      // digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
      this.adobeAnalyticsDataLayerService.adobeTrackClick();
      // this.kenticoTranslateService.getItem<any>('customers_tim_pet').pipe(take(1)).subscribe(item => {
      //   const stepName = item?.insurance_info_title_mp?.value;
      //   digitalData.page.pageInfo.pageName = stepName;
      //   this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      // });

      this.nextStep.emit(this.form);
      this.petKindData.emit(this.petKind);
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  markFormGroupTouched(formGroup: UntypedFormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as UntypedFormGroup);
      }
    });
  }

  previousPage() {
    this.checkoutService.InsuranceInfoState$.next("choicePacket");
    // this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    this.nextStep.emit(this.form);
    this.petKindData.emit(this.petKind);
  }

  fromViewToModel(form: UntypedFormGroup): PetInfo {
    return {
      petName: form.controls.petName.value,
      kind: form.controls.kind.value,
      chip: form.controls.microChip.value,
      breed: null,
      birthDate: TimeHelper.fromNgbDateToDate(form.controls.birthDate.value),
      informationPackage: null,
    };
  }

  computeProduct(): PetInfo {
    const petInfo: PetInfo = this.fromViewToModel(this.form);
    Object.assign(this.product, petInfo);
    return <CheckoutStepInsuranceInfoMiFidoProduct>(
      Object.assign({}, this.product, { insuredSubjects: null })
    );
  }

  submit() {
    const form: any = {
      paymentmethod: "",
      mypet_pet_type: this.petKind,
      codice_sconto: "no",
      sci_numassicurati: 0,
      sci_min14: 0,
      sci_polizza: "",
    };
    this.dataService.kind = this.petKind;
    const number = this.product.order.id + "";
    let digitalData: digitalData =
      this.adobeAnalyticsDataLayerService.setDigitalData(
        this.product,
        1,
        number,
        {},
        form,
        "tim broker",
        ""
      );
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);

    this.operation.emit("next");
  }
}
