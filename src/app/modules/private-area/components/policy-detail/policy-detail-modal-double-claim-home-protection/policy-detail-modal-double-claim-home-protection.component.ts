import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ClaimReport, User } from '@model';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService, InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Policy } from 'app/modules/private-area/private-area.model';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recaps/policy-detail-recap-dynamic.component';
import { NypExternalClaimService, NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { ExternalClaimUser } from 'app/core/models/claims/external-claim-user.model';

@Component({
    selector: 'app-policy-detail-modal-double-claim-home-protection',
    templateUrl: './policy-detail-modal-double-claim-home-protection.component.html',
    styleUrls: ['./policy-detail-modal-double-claim-home-protection.component.scss'],
    standalone: false
})
export class PolicyDetailModalDoubleClaimHomeProtectionComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() policyData: Policy;
  assistanceFlag: boolean = true;
  allOtherFlag: boolean = false;
  claimForm: UntypedFormGroup;
  docsList: UntypedFormArray;
  fileContainer = [];
  fileMaxSize: any;
  noEncodedfileContainer = [];
  allowSubmit = true;
  staticText: any;
  datepicker: NgbDateStruct;
  textAreaClaim: string;
  listTypeAcceptance = '.zip, .rar, .7z, .jpg, .jpeg, .png, .pdf, .doc, .docx, .odt, .xsl, .xlsx, .ods';
  richiestaInviata: boolean;
  base64FileContainer = [];

  error_file_dimension: string = "";
  error_file_mandatory: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    protected nypInsurancesService: NypInsurancesService,
    protected nypExternalClaimService: NypExternalClaimService,
    private kenticoTranslateService: KenticoTranslateService,
    private modalService: NgbModal,) {
    super();
  }

  ngOnInit() {
    this.claimsForm();
  }

  changeAssistanceFlag() {
    if (this.assistanceFlag === false) {
      this.assistanceFlag = !this.assistanceFlag;
      this.allOtherFlag = !this.allOtherFlag;
    }
    return this.assistanceFlag;
  }

  changeAllOtherFlag() {
    if (this.allOtherFlag === false) {
      this.allOtherFlag = !this.allOtherFlag;
      this.assistanceFlag = !this.assistanceFlag;
    }
    return this.allOtherFlag;
  }

  claimsForm(): void {
    this.claimForm = this.formBuilder.group({
      textAreaClaim: [null, Validators.required]
    });
  }

  removeDocs(index) {
    this.fileContainer.splice(index, 1);
    this.noEncodedfileContainer.push(this.fileContainer);
    this.uploadFileCheck();
  }

  onFileChange(event, index) {
    const file = event.target.files[0];
    if (file != undefined) {
      this.fileContainer.push(file);

      this.uploadFileCheck();
      this.noEncodedfileContainer.push(this.fileContainer);
    }
  }


  uploadFileCheck() {
    const fileSize = this.fileContainer.map(item => item.size);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    this.fileMaxSize = fileSize.reduce(reducer);
    const checkFileSize = this.fileMaxSize / 1048576;
    if (checkFileSize <= 5) {
      this.allowSubmit = true;
      this.error_file_dimension = "";
    } else {
      this.allowSubmit = false;
      this.error_file_dimension = this.kenticoContent.warning.value;
    }
  }

  formatDate(date: NgbDateStruct) {

    const formatDate = new Date(Date.UTC(date.year, date.month - 1, date.day - 1, 24, 0, 0));
    return formatDate.toISOString();
  }
  claimReport() {

    const userClaim: ExternalClaimUser = this.convertUserToExternalClaimUser(this.authService.loggedUser);
    const product = NypInsurancesService.products.products.find(product => product.product_code == this.policyData.product.product_code)
    if (!(this.claimForm.valid && this.allowSubmit)) {
      this.validateAllFormFields(this.claimForm);
    } else {
      let policyNumber: string | number;
      if (this.policyData.policyNumber != null && this.policyData.policyNumber != undefined && this.policyData.policyNumber != '') {
        policyNumber = this.policyData.policyNumber;
      } else {
        policyNumber = this.policyData.masterPolicyNumber;
      }
      // let todayDate = moment().format('DD/MM/YYYY');
      let claimDate = new Date().toISOString().split('T')[0]
      let claimType = "";
      if (this.assistanceFlag) {
        claimType = "Assistenza imprevisti";
      } else if (this.allOtherFlag) {
        claimType = "Tutte le altre coperture";
      }
      const cont = this.noEncodedfileContainer[0];
      for (let i = 0; i < cont.length; i++) {
        const fileToBase64 = (filename, filepath) => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = function (event: any) {
              resolve(event.target.result);
            };
            reader.readAsDataURL(this.fileContainer[i]);
          });
        };
        fileToBase64(this.fileContainer[i], '').then(result => {
          this.base64FileContainer.push({ attachment: result });
          if (!--cont.length) {
            let body: any = {
              policy_number: policyNumber,
              date: claimDate,
              message: this.claimForm.controls.textAreaClaim.value,
              note: "",
              company: product.insuranceCompany,
              policyId: this.policyData.id, // prenderlo dalla policy
              claimConf: product?.claim?.claim_type,
              product_code: product.product_code,
              provider: product?.claim?.claim_provider ?? null,
              claim: {
                claim_type: claimType,
                insured: userClaim,
                policy_type: product?.claim?.additionInfoLegacy?.claimProperties?.provider?.policyType,
                attachments: this.base64FileContainer,
              }
            }
            this.nypInsurancesService.sendClaimTim(this.policyData.id, body).subscribe((res) => {
              let kenticoContent = {};
              this.kenticoTranslateService.getItem<any>('modal_tim_confirm_home_protection_open_claim').pipe().subscribe(item => {
                kenticoContent = item;
                console.log(kenticoContent);
                const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
                (<ContainerComponent>modalRef.componentInstance).type = 'PolicyConfirmModalClaimHomeProtection';
                (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
              });
            }, (error) => {
              throw error;
            });
          }
        });
      }
      this.activeModal.close('Close click');
    }
  }

  private convertUserToExternalClaimUser(u: User): ExternalClaimUser {
    const external: ExternalClaimUser = new ExternalClaimUser();
    external.name = u.address.firstname + ' ' + u.address.lastname;
    external.fiscal_code = u.address.taxcode;
    external.email = u.email;
    external.phone = u.address.phone;
    external.birth_place = !!u.address.birth_city && u.address.birth_city.name || '';
    external.birth_day = moment(u.address.birth_date).format('DD/MM/YYYY');
    external.resident.city = u.address.city;
    external.resident.street = this.getNumeroCivicoFromAddress(u.address.address1);
    external.resident.square = this.getStreetFromAddress(u.address.address1);
    external.resident.province = !!u.address.state && u.address.state.name || '';
    external.resident.postcode = u.address.zipcode;


    // add italian prefix if not present into phone field
    if (!!external.phone && external.phone.startsWith('0039')) {
      external.phone = '+39' + external.phone.substring('0039'.length);
    }
    if (!!external.phone && !external.phone.startsWith('+39')) {
      external.phone = '+39' + external.phone;
    }

    return external;
  }

  private getNumeroCivicoFromAddress(address: string): string {
    const execResult: RegExpExecArray = /^([a-zA-Z\s]*)[\W\s]*(.*?[\d\s]+[\W+]*)$/.exec(address);
    if (!execResult) {
      return address;
    }

    return execResult[2];
  }

  private getStreetFromAddress(address: string): string {
    const execResult: RegExpExecArray = /^([a-zA-Z\s]*)[\W\s]*(.*?[\d\s]+[\W+]*)$/.exec(address);
    if (!execResult) {
      return address;
    }

    return execResult[1];


  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
}
