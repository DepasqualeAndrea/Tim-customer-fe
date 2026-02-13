import { Component, HostListener } from '@angular/core';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { NypConfigurationService } from '@NYP/ngx-multitenant-core';
import { NetCyberBusinessCheckoutService } from '../../services/checkout.service';
import { UtilsServiceCyber } from '../../services/utils.service';


@Component({
    selector: 'app-checkout-orchestrator',
    templateUrl: './checkout-orchestrator.component.html',
    styleUrls: ['./checkout-orchestrator.component.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
    standalone: false
})
export class CheckoutOrchestratorComponent {
  public isMobile: boolean = window.innerWidth < 768;
  public isTablet: boolean = window.innerWidth < 992;
  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
    this.isTablet = event.target.innerWidth < 992;
  }

  public Order$ = this.nypDataService.Order$;
  isRoundedViewEnabled: boolean = false;

  constructor(
    public checkoutService: NetCyberBusinessCheckoutService,
    public nypDataService: NypDataService,
    public componentFeatureService: ComponentFeaturesService,
    private nypConfigurationService: NypConfigurationService,
    private cyberUtilsService: UtilsServiceCyber
  ) { }

  ngOnInit(): void {
    this.setPrivateArea();
    this.nypDataService.CurrentState$.next(this.nypDataService.StateAfterRedirect ?? 'insurance-info');
    this.getComponentFeatures();
  }

  private getComponentFeatures(): void {
    this.nypConfigurationService.getComponentFeature().subscribe({
      next: (response) => {
        this.componentFeatureService.setComponentFeatures(response.data);
        this.setupFeatureFlags();
      },
      error: (err) => {
        console.error('Failed to load component features', err);
        this.isRoundedViewEnabled = false;
      }
    });
  }

  private setupFeatureFlags(): void {
    this.componentFeatureService.useComponent('main-layout');
    this.componentFeatureService.useRule('rounded-view');

    const isEnabled = this.componentFeatureService.isRuleEnabled();
    const constraints = this.componentFeatureService.getConstraints();

    const currentProductCode = this.Order$.value?.packet?.data?.product?.code;
    this.isRoundedViewEnabled = isEnabled && constraints.has('product-codes') && constraints.get('product-codes').includes(currentProductCode);
  }

    setPrivateArea(){
    this.cyberUtilsService.setNypPrivateArea(true);
  }
}