import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Policy } from 'app/modules/private-area/private-area.model';
import { ToastrService } from 'ngx-toastr';
import { ModalWithdrawalSuccessNetComponent } from '../modal-withdrawal-success-net/modal-withdrawal-success-net.component';

@Component({
    selector: 'app-policy-detail-modal-withdrawal-net',
    templateUrl: './policy-detail-modal-withdrawal-net.component.html',
    styleUrls: ['./policy-detail-modal-withdrawal-net.component.scss'],
    standalone: false
})
export class PolicyDetailModalWithdrawalNetComponent implements OnInit {

  @Input() policyData: Policy;
  kenticoContent;
  expirationDate: string;
  form: UntypedFormGroup;
  placeholder: string = "...";
  constructor(public activeModal: NgbActiveModal,
    public kenticoTranslateService: KenticoTranslateService,
    private formBuilder: UntypedFormBuilder,
    public insurancesService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    private modalService: NgbModal,
    public dataService: DataService,
    private toastService: ToastrService) {
  }

  ngOnInit() {
    this.getContent();
    this.form = this.createForm();
  }
  getContent() {
    this.kenticoTranslateService.getItem<any>('modal_withdrawal_yolo_for_ski').pipe().subscribe(item => {
      this.kenticoContent = item;
    });
  }
  private createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      message: [null],
    });
  }
  confirmWithdrawal() {
    this.nypInsurancesService.withdraw(this.policyData.id, this.form.controls.message.value).subscribe(res => {
      this.activeModal.close();
      const modalRefSuccess = this.modalService.open(ModalWithdrawalSuccessNetComponent,
        { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', backdrop: 'static', keyboard: false, centered: true });
      modalRefSuccess.componentInstance.kenticoContent = this.kenticoContent;
    },
      error => {
        this.toastService.error(error);
      });
  }
  closeModal() {
    this.activeModal.close();
  }
}
