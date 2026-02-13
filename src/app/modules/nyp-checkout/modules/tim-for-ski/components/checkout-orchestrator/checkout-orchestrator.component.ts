import { Component, HostListener, OnInit } from '@angular/core';
import { TimForSkiCheckoutService } from '../../services/checkout.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';

@Component({
    selector: 'app-checkout-orchestrator',
    templateUrl: './checkout-orchestrator.component.html',
    styleUrls: ['./checkout-orchestrator.component.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
    standalone: false
})
export class CheckoutOrchestratorComponent implements OnInit {
  summaryStates: CheckoutStates[] = ['address', 'insurance-info', 'consensuses', 'survey', 'thank-you'];
  public selectedPacket: string;
  public isMobile: boolean = window.innerWidth < 768;
  public isTablet: boolean = window.innerWidth < 992;
  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
    this.isTablet = event.target.innerWidth < 992;
  }

  constructor(public checkoutService: TimForSkiCheckoutService, public nypDataService: NypDataService) { }

  ngOnInit(): void {
    this.nypDataService.CurrentState$.next(this.nypDataService.StateAfterRedirect ?? 'insurance-info');
    const packetCode = this.nypDataService.Order$.value.packet.data.product.code;
    this.selectedPacket = this.getSelectedPacket(packetCode);
  }
  getSelectedPacket(code: string): string {
    switch (code) {
      case 'tim-for-ski-silver':
        return 'BLU';
      case 'tim-for-ski-gold':
        return 'ROSSA';
      case 'tim-for-ski-platinum':
        return 'NERA';
      default:
        return '';
    }
  }

}
