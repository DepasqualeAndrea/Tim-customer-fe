import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterService } from 'app/core/services/router.service';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-agency-offer-activation',
    templateUrl: './agency-offer-activation.component.html',
    styleUrls: ['./agency-offer-activation.component.scss'],
    standalone: false
})
export class AgencyOfferActivationComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(
    public routerService: RouterService,
    ref: ChangeDetectorRef
  ) {
    super(ref);
  }
  
  ngOnInit() {
  }

  isLinkInternal(link: string): boolean {
    return link.startsWith('/')
  }


  goToLink(link) {
    this.isLinkInternal(link) ? this.routerService.navigate(link) : window.open(link, "_blank");
  }

}
