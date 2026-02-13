import { NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { concat } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimEhealthQuixaStandardCheckoutService } from '../../services/checkout.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss',
        '../../../../styles/shopping-cart.scss',
        '../../../../styles/size.scss',
        '../../../../styles/colors.scss',
        '../../../../styles/text.scss',
        '../../../../styles/common.scss'],
    standalone: false
})
export class ShoppingCartComponent implements OnInit {
  public Order$ = this.nypDataService.Order$;
  public isStickyCartOpen = true;
  public isSticky: boolean = false;
  public showStates: CheckoutStates[] = ['login-register', 'insurance-info' , 'address', 'consensuses', 'payment', 'thank-you'];
  private documentToDownload: string;
  public warranties: string;


  @Input('state') public state: CheckoutStates;
  @Input('isTablet') set _(isTablet: boolean) { this.isSticky = isTablet; this.isStickyCartOpen = !isTablet; }
  @ViewChild('innerhide') public HIDE;

  constructor(
    public checkoutService: TimEhealthQuixaStandardCheckoutService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
    public nypDataService: NypDataService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.nypDataService.CurrentProduct$.pipe(take(1)).subscribe(product => this.documentToDownload = product?.informativeSet);
    this.warranties = this.nypDataService.Order$.value.packet.data.warranties[0].anagWarranty.name;
    console.log("warranties", this.warranties = this.nypDataService.Order$.value.packet.data.warranties[0].anagWarranty.name)
    const customOrder = [15, 16, 17, 18, 19];
    this.nypDataService.Order$.value.packet.data.warranties.sort((a, b) => {
      const idA = a.anagWarranty.id;
      const idB = b.anagWarranty.id;

      const indexA = customOrder.indexOf(idA);
      const indexB = customOrder.indexOf(idB);

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

}

export interface ISelectedWarranties {
  packet: string;
  warranties: string[];
}
