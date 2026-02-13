import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { TimBillProtectionCheckoutService } from '../../../services/checkout.service';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { InsuranceInfoDetailsModalComponent } from '../../../modal/insurance-info-details-modal/insurance-info-details-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-checkout-step-insurance-info-packets',
    templateUrl: './checkout-step-insurance-info-packets.component.html',
    styleUrls: ['./checkout-step-insurance-info-packets.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoPacketsComponent implements OnInit {
  public readonly pageStates: CheckoutStates[] = ['insurance-info'];
  public readonly titleStates: CheckoutStates[] = [];
  public readonly summaryStates: CheckoutStates[] = ['address', 'survey', 'consensuses'];
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;
  @Input('isMobileView') public isMobileView: boolean = false;
  @Output() packetSelected: EventEmitter<string> = new EventEmitter<string>();
  public readonly KenticoPrefix = 'insurance_info';
  public warranties: any[] = [];
  public Order$ = this.nypDataService.Order$;
  packetName: string = 'desiredPacketName';
  isChecked = false;

  constructor(
    public nypDataService: NypDataService,
    public checkoutService: TimBillProtectionCheckoutService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.warranties = this.Order$?.value.packet.data.warranties || [];

  }
  submit(packetName: string) {
    this.selectPacket(packetName);
  }

  selectPacket(packetName: string) {
    this.packetSelected.emit(packetName);
    this.checkoutService.InsuranceInfoState$.next('insured-documents');
  }

  openWarrantiesInfoModal() {

    const modalRef = this.modalService.open(InsuranceInfoDetailsModalComponent, {
      size: "lg",
      windowClass: "modal-window",
    });

  }
}
