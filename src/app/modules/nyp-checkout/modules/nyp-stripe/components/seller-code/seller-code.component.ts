import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutStepInsuranceInfoProduct } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';
import { SELLER_CODE_KENTICO_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { FormHumanError } from 'app/shared/errors/form-human-error.model';
import { KenticoPipe } from 'app/shared/pipe/kentico.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';;


export interface SellerCodeConfig {
  apiService: any;
  fieldName?: string;
  insuredItems?: any;
}

@Component({
  selector: 'app-seller-code',
  template: `
  <ng-container *ngIf="!isSuccess; else successTemplate">
    <div class="seller-accordion-wrapper mt-1">
      <div class="accordion-header d-flex justify-content-between align-items-center"
        [ngClass]="{ 'open': accordionOpen }" (click)="toggleAccordion()">
        <span class="accordion-title p-container">
          {{ 'seller_code.title' | kentico }}
        </span>
        <span class="accordion-icon" [ngClass]="{ 'open': accordionOpen }">
          <i [ngClass]="accordionOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </span>
      </div>
      <div class="accordion-content" [ngClass]="{ 'open': accordionOpen }">
        <div [formGroup]="sellerCodeForm" class="seller-code-linear-stepper">
          <div class="w-100">
            <div
              class="col-12 tim-seller-container d-sm-flex align-items-sm-end justify-content-sm-between">
              <div class="flex-grow-1 mb-3 mb-sm-0 input-txt-container">
                <label for="sellerCode" class="label-container" [ngClass]="{ 'error-field': isError}">
                  <input
                    id="sellerCode"
                    type="text"
                    formControlName="sellerCode"
                    required
                    [ngClass]="{ 'error-field': isError}">
                  <span [ngClass]="sellerCodeForm?.get('sellerCode')?.value ? 'up' : ''" class="real-label">
                    {{ 'seller_code.label' | kentico }}
                  </span>
                  <i *ngIf="isError" class="fas fa-times input-error-icon"></i>
                </label>
              </div>
              <button
                class="basic-outline c-cta d-block apply-seller-code"
                id="applySellerCode"
                type="button"
                [disabled]="!sellerCodeForm.get('sellerCode')?.value || isLoading"
                (click)="handleSellerCode()"
              >
                <span class="btn-label-apply">{{ 'seller_code.button_text' | kentico }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ng-container>

    <ng-template #successTemplate>
      <div class="accordion-header-success">
        <span class="accordion-title p-container">
          {{ 'seller_code.title' | kentico }}
        </span>
      </div>
      <div class="col-12 alert alert-success mt-1">
        <div class="row align-items-center">
          <div class="col-1 icon-center">
            <i class="fa fa-info fa-2x"></i>
          </div>
          <div class="col-11">
            <p class="m-0">{{ 'seller_code.success_message' | kentico }}</p>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./seller-code.component.scss', '../../../../styles/checkout-forms.scss']
})
export class SellerCodeComponent implements OnInit {

  @Input() config: SellerCodeConfig;
  @Input() product: CheckoutStepInsuranceInfoProduct;

  @Output() onSuccess = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @Output() onCodeChange = new EventEmitter<string>();

  public sellerCodeForm: FormGroup;
  public isError: boolean = false;
  public isSuccess: boolean = false;
  public accordionOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private kentico: KenticoPipe,
  ) { }

  get sellerCodeControl() {
    return this.sellerCodeForm.get('sellerCode');
  }

  toggleAccordion(): void {
    this.accordionOpen = !this.accordionOpen;
  }

  ngOnInit(): void {

    this.initForm();

  }

  private initForm(): void {
    this.sellerCodeForm = this.fb.group({
      sellerCode: ['', Validators.required]
    });

    this.sellerCodeControl?.valueChanges.subscribe(value => {
      this.resetStates();
      this.onCodeChange.emit(value);
    });
  }

  private resetStates(): void {
    this.isError = false;
    this.isSuccess = false;
  }

  handleSellerCode(): void {
    if (!this.config?.apiService || !this.sellerCodeControl?.value) {
      return;
    }

    this.resetStates();

    const fieldName = this.config.fieldName || 'seller_code';


    const orderItems = {
      ...(this.config.insuredItems || {} as any),
      [fieldName]: this.sellerCodeControl.value
    };


    const payload = {
      insuredItems: orderItems
    };

    const apiCall: Observable<any> = this.config.apiService.putOrder(payload);

    apiCall.subscribe({
      next: (response) => {
        this.isSuccess = true;

        if (response) {
          localStorage.setItem('order', JSON.stringify(response));
        }

        this.onSuccess.emit({
          response,
          sellerCode: this.sellerCodeControl.value
        });
        this.toastr.success(this.kentico.transform(SELLER_CODE_KENTICO_NAME + '.success_message'));
      },
      error: (error) => {
        this.isError = true;

        this.sellerCodeControl?.reset();
        this.sellerCodeControl?.updateValueAndValidity();

        this.onError.emit({
          error,
          sellerCode: this.sellerCodeControl.value
        });
        this.toastr.error(this.kentico.transform(SELLER_CODE_KENTICO_NAME + '.error_message'));
        throw new FormHumanError('Invalid seller code');
      }
    });
  }
}
