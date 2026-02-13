import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Policy } from '../../../private-area.model';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { DataService, InsurancesService } from '@services';
import { PolicyConfirmModalClaimComponent } from '../policy-confirm-modal-claim/policy-confirm-modal-claim.component';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ToastrService } from 'ngx-toastr';
import { AddonContent } from './interfaces/modal-claim-attachments.model';
import { ContentItem } from 'kentico-cloud-delivery';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { NgbDateHelper } from 'app/shared/ngb-date-helper';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';


@Component({
    selector: 'app-policy-detail-modal-claim-attachments',
    templateUrl: './policy-detail-modal-claim-attachments.component.html',
    styleUrls: ['./policy-detail-modal-claim-attachments.component.scss'],
    standalone: false
})
export class PolicyDetailModalClaimAttachmentsComponent implements OnInit {

  policy: Policy;

  @Input() public policyData;
  outgoings_refund: ContentItem;
  outgoings_refund_vip: ContentItem;
  formModule: boolean = false;
  docsList: UntypedFormArray;
  fileContainer = [];
  fileMaxSize: any;
  careSupport: AddonContent;
  careSupportFound: AddonContent;
  civilLiability: AddonContent;
  legal_protection: ContentItem;
  staticText: ContentItem;
  base64FileContainer = [];
  addonsKentico: Array<ContentItem>;
  clinicalRecords: any;
  identityDocument: any;
  stateCertificate: any;
  allowSubmit = false;
  addonName: string;
  cont = [];
  todayDate: string;
  claimForm: UntypedFormGroup;
  addons: Array<{ name: string, code: string }> = [];
  addon: string = null;
  openPicker: boolean = false;
  stringFromDate: string;
  claimMessage: string;
  fileNameList = [];
  richiestaInviata = false;
  datepicker: NgbDateStruct;
  claimDate: NgbDateStruct;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  yoloEndDate: string;
  noEncodedfileContainer = [];
  listTypeAcceptance = '.zip, .rar, .7z, .jpg, .jpeg, .png, .pdf, .doc, .docx, .odt, .xsl, .xlsx, .ods';

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private insurancesService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    private formBuilder: UntypedFormBuilder,
    private kenticoTranslateService: KenticoTranslateService,
    private toastr: ToastrService,
    private dateHelper: NgbDateHelper
  ) { }

  ngOnInit() {
    this.policy = this.route.snapshot.data.policy;
    this.startDate = {
      year: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('DD')
    };

    this.claimDateRange();
    this.claimsForm();
    this.claimOneBoxPet();
    this.claimTwoBoxPet();
    this.claimPetStaticTxt();
    this.addonsArray();
  }

  claimDateRange() {
    this.todayDate = moment().format('DD/MM/YYYY');
    this.yoloEndDate = this.dataService.genEndDateYoloWay(this.policyData.expirationDate);

    this.endDate = {
      year: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('DD')
    };
    this.claimDate = {
      year: +moment(this.todayDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.todayDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.todayDate, 'DD/MM/YYYY').format('DD')
    };


    if (moment().isBefore(this.endDate) && this.policyData.status !== 'expired') {
      return this.endDate = {
        year: +moment(this.todayDate, 'DD/MM/YYYY').format('YYYY'),
        month: +moment(this.todayDate, 'DD/MM/YYYY').format('MM'),
        day: +moment(this.todayDate, 'DD/MM/YYYY').format('DD')
      };
    } else {
      return this.endDate;
    }
  }

  addonsArray() {
    this.nypInsurancesService.getInsuranceById(this.policyData.id).pipe(
      switchMap((res) => {
        if (res.addons[0]) {
          this.addons.push({ name: res.addons[0].name, code: res.addons[0].code });
        }
        return this.getClaimPetAddonsContent()
      })
    ).subscribe(item => {
      this.addonsKentico = item.linked_items.value[0].linked_items.value;
      this.addonsKentico.forEach(element => {
        if (element.product_type.value.includes(this.policyData.product.product_code)) {
          this.addons.push({ name: element.name.value, code: element.code.value });
        }
      });
    });
  }


  claimOneBoxPet() {
    this.kenticoTranslateService.getItem<ContentItem>('claim_one_box_pet').pipe(take(1)).subscribe(item => {
      this.outgoings_refund = item.claim_addons.value[0];
      this.outgoings_refund_vip = item.claim_addons.value[1];
      this.legal_protection = item.claim_addons.value[2];
    });
  }

  claimTwoBoxPet() {
    this.kenticoTranslateService.getItem<ContentItem>('addon_pet_two_boxes').pipe(take(1)).subscribe(item => {
      this.careSupport = { box_one: item.box_one.value[0], box_two: item.box_two.value[0], extraBox: item.extra_box_txt.value };
      this.careSupportFound = { box_one: item.box_one.value[1], box_two: item.box_two.value[1], extraBox: item.extra_box_txt.value };
      this.civilLiability = { box_one: item.box_one.value[2], box_two: item.box_two.value[2] };
    });
  }

  claimPetStaticTxt() {
    this.kenticoTranslateService.getItem<ContentItem>('pet_helvetia_open_claim').pipe(take(1)).subscribe(item => {
      this.staticText = item;
    });
  }

  private getClaimPetAddonsContent(): Observable<ContentItem> {
    return this.kenticoTranslateService.getItem<ContentItem>('addons_pet_helvetia').pipe(take(1))
  }

  claimsForm(): void {
    this.claimForm = this.formBuilder.group({
      fileSource: new UntypedFormControl(),
      selectAddon: [null, Validators.nullValidator],
      claimDate: [null, Validators.required],
      timepicker: [null, Validators.required],
      place: [null, Validators.required],
      claimMessage: [null, Validators.required],
      claimContatcs: [null, Validators.required],
      clinicalRecords: [null, Validators.required],
      identityDocument: [null, Validators.required],
      stateCertificate: [null, Validators.required],
      otherDocs: this.formBuilder.array([this.createOtherDocsForm()]),
      fileDescription: null,
      declare: [null, Validators.required],
    });
    this.claimForm.addValidators(
      this.dateHelper.createDateValidator(
        this.claimForm,
        'claimDate',
        this.startDate,
        this.endDate)
    )
    this.claimForm.controls.selectAddon.valueChanges.subscribe((addon: { code: string, name: string }) =>
      this.selectAddon(addon)
    )
    this.docsList = this.claimForm.get('otherDocs') as UntypedFormArray;
  }


  createOtherDocsForm(): UntypedFormGroup {
    return this.formBuilder.group({
      docs: new UntypedFormControl(),
      name: new UntypedFormControl(),
      file: new UntypedFormControl()
    });
  }

  getDocsForm(): UntypedFormArray {
    return this.claimForm.get('otherDocs') as UntypedFormArray;
  }

  addDocs() {
    this.docsList.push(this.createOtherDocsForm());
  }

  removeOtherDocs(index: number) {
    index === 0
      ? this.docsList.controls[index].reset()
      : this.docsList.removeAt(index);
  }

  removeClaimDocs(formField: string) {
    this.claimForm.controls[formField].reset();
    this[formField] = '';
  }

  openFormModule() {
    this.formModule = true;
  }

  onFileChange(event, index) {
    const file = event.target.files[0];
    if (event.target.id === 'clinicalRecords') {
      this.clinicalRecords = file.name;
      if (this.cont[0]) {
        this.cont[0] = file;
      } else {
        this.cont.push(file);
      }
    }
    if (event.target.id === 'identityDocument') {
      this.identityDocument = file.name;
      if (this.cont[1]) {
        this.cont[1] = file;
      } else {
        this.cont.push(file);
      }
    }
    if (event.target.id === 'stateCertificate') {
      this.stateCertificate = file.name;
      if (this.cont[2]) {
        this.cont[2] = file;
      } else {
        this.cont.push(file);
      }
    }
    if (event.target.id.includes('docs')) {
      const name = (<UntypedFormArray>this.claimForm.controls.otherDocs);
      const patchFile = (<UntypedFormArray>this.claimForm.controls.otherDocs);
      (<UntypedFormArray>name.controls[index].get('name')).patchValue(file.name);
      (<UntypedFormArray>patchFile.controls[index].get('file')).patchValue(file);
    }
    this.claimForm.patchValue({
      fileSource: file
    });

    this.submit();
  }


  createFileContainer() {
    this.noEncodedfileContainer.push(this.cont);
    this.claimForm.controls.otherDocs.value.map(item => {
      if (item.file) {
        this.noEncodedfileContainer[0].push(item.file);
      }
    });
  }


  submit() {
    const formData = this.claimForm.controls.fileSource.value;
    this.fileContainer.push(formData);
    const fileSize = this.fileContainer.map(item => item.size);
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    this.fileMaxSize = fileSize.reduce(reducer);
    const checkFileSize = this.fileMaxSize / Math.pow(1024, 2);
    if (checkFileSize <= 20) {
      this.createFileContainer();
      this.allowSubmit = true;
    } else {
      this.toastr.warning(this.staticText.warning.value);
    }
  }

  public selectAddon(addon: { code: string, name: string }): void {
    this.addon = addon.code;
    this.addonName = addon.name;
  }

  toggleDatePicker() {
    this.openPicker = !this.openPicker;
  }

  getFileName(fileInput: any) {
    const fileName = fileInput.target.files[0].name;
    this.fileNameList.push(fileName);
  }

  removeFile(file: string) {
    const filteredAry = this.fileNameList.filter(f => f !== file);
    this.fileNameList = filteredAry;
  }

  submitClaim() {
    if (!(this.claimForm.valid && this.allowSubmit)) {
      this.validateAllFormFields(this.claimForm);
    } else {
      const cont = this.noEncodedfileContainer[0];
      for (let i = 0; i < cont.length; i++) {
        const fileToBase64 = (filename, filepath) => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = function (event: any) {
              resolve(event.target.result);
            };
            reader.readAsDataURL(this.cont[i]);
          });
        };
        fileToBase64(this.cont[i], '').then(result => {
          this.base64FileContainer.push({ attachment: result });
          if (!--cont.length) {
            const body = {
              date: this.claimForm.controls.claimDate.value,
              message: this.claimForm.controls.claimMessage.value,
              note: this.claimForm.controls.claimContatcs.value,
              policy_number: this.policyData.policyNumber,
              data: {
                place: this.claimForm.controls.place.value,
                hour: this.claimForm.controls.timepicker.value,
                attachment_message: this.claimForm.controls.fileDescription.value || ''
              },
              attachments_attributes: this.base64FileContainer
            };
            this.insurancesService.submitClaims(body).subscribe((res) => {
              this.richiestaInviata = true;
              const modalRef = this.modalService.open(PolicyConfirmModalClaimComponent, { size: 'lg' });
            }, (error) => {
              throw error;
            });
          }
        });
      }
      this.activeModal.close('Close click');
    }
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

