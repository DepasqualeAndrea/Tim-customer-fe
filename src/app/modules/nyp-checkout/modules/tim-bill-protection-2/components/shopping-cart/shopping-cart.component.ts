import { NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { concat } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimBillProtectionCheckoutService } from '../../services/checkout.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoDetailsModalComponent } from '../../modal/info-details-modal/info-details-modal.component';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss']
})
export class ShoppingCartComponent implements OnInit {
  public Order$ = this.nypDataService.Order$;
  public isStickyCartOpen = true;
  public isSticky: boolean = false;
  public showStates: CheckoutStates[] = ['insurance-info', 'login-register', 'address', 'survey', 'payment', 'consensuses', 'thank-you'];
  private documentToDownload: string;

  @Input('state') public state: CheckoutStates;
  @Input('isTablet') set _(isTablet: boolean) { this.isSticky = isTablet; this.isStickyCartOpen = !isTablet; }
  @ViewChild('innerhide') public HIDE;

  constructor(
    public checkoutService: TimBillProtectionCheckoutService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
    public nypDataService: NypDataService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.nypDataService.CurrentProduct$.pipe(take(1)).subscribe(product => this.documentToDownload = product?.informativeSet);
  }

  toggleStickyCart() {
    this.isStickyCartOpen = !this.isStickyCartOpen;
  }

  downloadProductDocuments() {
    this.nypIadDocumentaryService.downloadFileFromUrl({ filename: this.documentToDownload?.split('/')?.pop(), remoteUrl: this.documentToDownload })
      .pipe(
        map(r => ({ content: r, filename: this.documentToDownload?.split('/')?.pop(), }))
      )
      .subscribe(b => saveAs(b.content, b.filename));
  }

}

export interface ISelectedWarranties {
  packet: string;
  warranties: string[];
}