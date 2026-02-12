import { NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { concat } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimSportCheckoutService } from '../../services/checkout.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoDetailsModalComponent } from '../../modal/info-details-modal/info-details-modal.component';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: [
    './shopping-cart.component.scss',
    '../../../../styles/shopping-cart.scss',
    '../../../../styles/size.scss',
    '../../../../styles/colors.scss',
    '../../../../styles/text.scss',
    '../../../../styles/common.scss'
  ]
})
export class ShoppingCartComponent implements OnInit {
  public warranties: any[] = [];
  public Order$ = this.nypDataService.Order$;
  public isStickyCartOpen = true;
  public isSticky: boolean = false;
  public showStates: CheckoutStates[] = ['insurance-info', 'login-register', 'address', 'survey', 'payment', 'consensuses', 'thank-you', 'user-control'];
  private documentToDownload: string;

  @Input('state') public state: CheckoutStates;
  @Input('isTablet') set _(isTablet: boolean) { this.isSticky = isTablet; this.isStickyCartOpen = !isTablet; }
  @ViewChild('innerhide') public HIDE;

  constructor(
    public checkoutService: TimSportCheckoutService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
    public nypDataService: NypDataService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.nypDataService.CurrentProduct$.pipe(take(1)).subscribe(product => this.documentToDownload = product?.informativeSet);
    this.warranties = this.Order$?.value.packet.data.warranties || [];
    const order = [20, 48, 49, 50, 1];
    this.warranties.sort((a, b) => {
      const idA = a.anagWarranty.id;
      const idB = b.anagWarranty.id;

      const indexA = order.indexOf(idA);
      const indexB = order.indexOf(idB);

      return indexA - indexB;
    });
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
  openInfoDetailsModal() {

    const modalRef = this.modalService.open(InfoDetailsModalComponent, {
      size: "lg",
      windowClass: "modal-window",
    });

  }
}

export interface ISelectedWarranties {
  packet: string;
  warranties: string[];
}
