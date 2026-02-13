import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Policy } from '../../../private-area.model';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { InsurancesService, DataService, AuthService } from '@services';
import { PolicyConfirmModalClaimComponent } from '../policy-confirm-modal-claim/policy-confirm-modal-claim.component';
import { User } from '@model';
import { NypExternalClaimService, NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-policy-detail-modal-claim',
    templateUrl: './policy-detail-modal-claim.component.html',
    styleUrls: ['./policy-detail-modal-claim.component.scss'],
    standalone: false
})
export class PolicyDetailModalClaimComponent implements OnInit {

  policy: Policy;

  // @Input() public policyData;
  @Input() policyData: Policy;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthService,
    private nypInsurancesService: NypExternalClaimService
  ) { }

  openPicker = false;
  stringFromDate: string;
  claimDate: string;
  claimMessage: string;
  addDocs = true;
  hasDocument = false;
  fileNameList = [];
  datepicker: NgbDateStruct;
  richiestaInviata = false;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  yoloEndDate: string;


  ngOnInit() {
    this.policy = this.route.snapshot.data.policy;

    this.startDate = {
      year: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('DD')
    };

    const endDate = moment(this.policyData.expirationDate).format('DD/MM/YYYY') !== moment(this.policyData.startDate).format('DD/MM/YYYY')
      ? this.dataService.genEndDateYoloWay(this.policyData.expirationDate)
      : moment(this.policyData.expirationDate).format('DD/MM/YYYY');

    this.endDate = {
      year: +moment(endDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(endDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(endDate, 'DD/MM/YYYY').format('DD')
    };
  }

  setClaimDate() {
    this.claimDate = moment(`${this.datepicker.month}/${this.datepicker.day}/${this.datepicker.year}`, 'MM/DD/YYYY').format('YYYY-MM-DD');
    this.stringFromDate = moment(`${this.datepicker.month}/${this.datepicker.day}/${this.datepicker.year}`, 'MM/DD/YYYY').format('DD/MM/YYYY');
    this.openPicker = false;
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

  private convertUserToInternalClaimUser(u: User): any {
    console.log(u)
    const internal: any = {};
    internal.name = u.address.firstname + ' ' + u.address.lastname;
    internal.fiscal_code = u.address.taxcode;
    internal.email = u.email;
    internal.phone = u.address.phone;
    internal.birth_place = !!u.address.birth_city && u.address.birth_city.name || '';
    internal.birth_day = moment(u?.address.birth_date).format('DD/MM/YYYY');
    internal.resident = {
      city: u?.address?.city || '',
      street: this.getNumeroCivicoFromAddress(u.address?.address1),
      square: this.getStreetFromAddress(u.address?.address1),
      province: !!u.address?.state && u.address?.state?.name || '',
      postcode: u.address.zipcode,
    }

    // add italian prefix if not present into phone field
    if (!!internal.phone && internal.phone.startsWith('0039')) {
      internal.phone = '+39' + internal.phone.substring('0039'.length);
    }
    if (!!internal.phone && !internal.phone.startsWith('+39')) {
      internal.phone = '+39' + internal.phone;
    }

    return internal;
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
  submitClaim() {
    const userClaim: any = this.convertUserToInternalClaimUser(this.authService.loggedUser);
    const product = NypInsurancesService.products.products.find(product => product.product_code == this.policyData.product.product_code)
    const body = {
      date: this.claimDate,
      message: this.claimMessage,
      policy_number: this.policyData.policyNumber,
      policyId: this.policyData.id,
      claimConf: product?.claim?.claim_type,
      company: product.insuranceCompany,
      product_code: product.product_code,
      claim: {
        insured: userClaim,
        provider: product?.claim?.claim_provider,
        policy_type: product?.claim?.additionInfoLegacy?.claimProperties?.provider?.policyType
      }

    };

    this.nypInsurancesService.getMotionCloudClaimUrl(this.policyData.id, body, product.product_code).subscribe((res) => { //il nome è errato ma la chiamate è sempre la create (claim)      this.richiestaInviata = true;
      const modalRef = this.modalService.open(PolicyConfirmModalClaimComponent, { size: 'lg' });
    }, (error) => {
      throw error;
    });
  }
}
