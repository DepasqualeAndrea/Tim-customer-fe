import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { CheckoutService, DataService, InsurancesService, ProductsService, UserService } from '@services';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { ProductsList, RequestOrder } from '@model';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ContainerComponent } from '../../../../tenants/component-loader/containers/container.component';
import { Observable, throwError } from 'rxjs';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';


@Component({
    selector: 'app-quotator-y-multirischi',
    templateUrl: './quotator-y-multirischi.component.html',
    styleUrls: ['./quotator-y-multirischi.component.scss'],
    standalone: false
})
export class QuotatorYMultirischiComponent extends PreventivatoreAbstractComponent implements OnInit {
  @Input() product: any;
  @Output() actionEventAtecoProduct: EventEmitter<any> = new EventEmitter<any>();
  form: UntypedFormGroup;
  showErrorMessagge = false;
  products: ProductsList['products'];
  constructor(
    ref: ChangeDetectorRef,
    public dataService: DataService,
    private toastrService: ToastrService,
    public router: Router,
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public insuranceService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    public checkoutService: CheckoutService,
    public productsService: ProductsService,
    public kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService,
    public modalService: NgbModal,
  ) {
    super(ref);
  }

  ngOnInit() {
    this.nypInsurancesService.getProducts().subscribe(list => {
      this.products = list.products;
    });
    this.form = new UntypedFormGroup({
      fiscalCode: new UntypedFormControl('', [Validators.required])
    });
  }


  private createOrderObj(variant, codeAteco) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            quantity: 1,
            insurance_info_attributes: {
              ateco_id: codeAteco.ateco_id,
              has_beds: codeAteco.has_beds
            }
          },
        },
      }
    };
  }

  private createPayload(order: any, product: any) {
    const payload = {
      product: product,
      order: order,
      router: 'checkout'
    };
    return payload;
  }

  checkout() {
    if (this.form.valid) {
      this.dataService.retrieveCodeAteco(this.form.controls.fiscalCode.value).pipe(
        catchError(err => {
          if (err.error.exception === 'code_not_avaiable') {
            this.openModalQuotatorErrorCodeAteco();
          } else if (err.error.exception === 'invalid_format') {
            this.openModalQuotatorFormatInvalid();
          }
          return Observable.throwError(err);

        }),
        switchMap(codeAteco => {
          const productSelected = this.products.filter((f) => {
            return f.product_code === codeAteco.product_code;
          });

          // trigger product selection
          this.actionEventAtecoProduct.emit(productSelected[0]);
          this.dataService.setProduct(productSelected[0]);
          const order = this.createOrderObj(productSelected[0].master_variant, codeAteco);
          this.dataService.setParams({ ateco_id: codeAteco.ateco_id, has_beds: codeAteco.has_beds, productCode: productSelected[0].product_code, ateco: codeAteco });
          return this.checkoutService.addToChart(<RequestOrder>order);
        }),
        catchError(error => {
          this.showErrorMessagge = true;
          throw error;
        }),
      ).subscribe(response => {
        this.dataService.setResponseOrder(response);
        // console.log('prodotto settato da quotator', this.product)
        // this.dataService.setProduct(this.product);
        return this.router.navigate(['checkout']);
      });
    }
  }
  openModalQuotatorErrorCodeAteco() {
    let kenticoContent = {};
    const modalRef = this.modalService.open(ContainerComponent, {
      backdropClass:
        'backdrop-class ' + this.dataService.tenantInfo.main.layout,
      windowClass: 'modal-window',
      centered: true
    });
    this.kenticoTranslateService.getItem<any>('modal_ateco_vat').pipe().subscribe((item) => {
      kenticoContent = item;
      modalRef.componentInstance.type = 'ModalAtecoVat';
      modalRef.componentInstance.componentInputData = { 'kenticoContent': kenticoContent };
    });
  }


  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType];
  }

  openModalQuotatorFormatInvalid() {
    let kenticoItem = {};
    const modalRef = this.modalService.open(ContainerComponent, {
      backdropClass:
        'backdrop-class ' + this.dataService.tenantInfo.main.layout,
      windowClass: 'modal-window',
      centered: true
    });
    this.kenticoTranslateService.getItem<any>('modal_error_format').pipe().subscribe((item) => {
      kenticoItem = item;
      modalRef.componentInstance.type = 'ModalFormatInvalid';
      modalRef.componentInstance.componentInputData = { 'kenticoItem': kenticoItem };
    });
  }
}
