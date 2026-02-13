import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { CheckoutService } from '../../../core/services/checkout.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-variant-select',
    templateUrl: './variant-select.component.html',
    styleUrls: ['./variant-select.component.scss'],
    standalone: false
})
export class VariantSelectComponent implements OnInit {

  products: any;
  productId: number;

  constructor(
    private dataService: DataService,
    private ckService: CheckoutService,
    private router: Router,
  ) {
    this.products = {
      'products': [
        {
          'can_open_claim': false,
          'category': 'Health',
          'conditions': '',
          'conditions_package': '/conditions_packages/original/missing.png',
          'description': `<p><strong>Vuoi proteggere i tuoi animali domestici? Qua la zampa!</strong></p>
            <p>Scopri l'assicurazione on-demand per i tuoi animali domestici:</p><ul><li>Rimborso spese mediche per Infortunio o malattia con o senza intervento chirurgico</li>
            <li>Rimborso spese di ricerca in caso di smarrimento</li><li>Responsabilit&agrave; Civile e Tutela Legale in caso di danni a terzi*</li></ul><p>
            * Garanzie prestate soltanto da Yolo MiFido Gold</p><p>Scopri la soluzione che fa per te&hellip; e per il tuo amico animale!</p>`,
          'display_price': '13,00 €',
          'goods': [],
          'holder_maximum_age': 150,
          'holder_minimum_age': 0,
          'id': 39,
          'information_package': 'https://yolo-staging.s3.amazonaws.com/spree/products/information_packages/000/000/039/original/Fascicolo_informativo_def_YOLO_Mi_fido.pdf?1532950543',
          'master_variant': 140,
          'maximum_insurable': 1,
          'name': 'Yolo MiFido Gold',
          'only_contractor': false,
          'price': 13,
          'properties': [
            {
              'name': 'unique_name_presenter',
              'value': 'Yolo MiFido'
            }
          ],
          'short_description': 'Una polizza assicurativa che copre le spese mediche, la Responsabilità Civile e la Tutela Legale in caso di danni a terzi per cani e gatti di età compresa fra 6 mesi e 8 anni.',
          'type': 'SaraAssicurazioni::Pets::Product'
        },
        {
          'can_open_claim': false,
          'category': 'Health',
          'conditions': '',
          'conditions_package': '/conditions_packages/original/missing.png',
          'description': `<p><strong>Vuoi proteggere i tuoi animali domestici? Qua la zampa!</strong></p><p>Scopri l'assicurazione on - demand per i tuoi animali domestici: </p>
            <ul><li>Rimborso spese mediche per Infortunio o malattia con o senza intervento chirurgico</li > <li>Rimborso spese di ricerca in caso di smarrimento < /li>
            <li>Responsabilit&agrave; Civile e Tutela Legale in caso di danni a terzi*</li > </ul><p>* Garanzie prestate soltanto da Yolo MiFido Gold</p > <p>Scopri la soluzione che fa per te & hellip; e per il tuo amico animale! < /p>`,
          'display_price': '8,00 €',
          'goods': [],
          'holder_maximum_age': 150,
          'holder_minimum_age': 0,
          'id': 39,
          'information_package': 'https://yolo-staging.s3.amazonaws.com/spree/products/information_packages/000/000/038/original/Fascicolo_informativo_def_YOLO_Mi_fido.pdf?1532950300',
          'master_variant': 140,
          'maximum_insurable': 1,
          'name': 'Yolo MiFido Silver',
          'only_contractor': false,
          'price': 13,
          'properties': [
            {
              'name': 'unique_name_presenter',
              'value': 'Yolo MiFido'
            }
          ],
          'short_description': 'Una polizza assicurativa che copre le spese mediche sostenute per cani e gatti di età compresa fra 6 mesi e 8 anni, indicata se hai già la Responsabilità Civile del capo famiglia.',
          'type': 'SaraAssicurazioni::Pets::Product'
        }
      ]
    };
  }

  ngOnInit() {
    this.productId = this.dataService.idProdotto;
    this.getProduct();
  }

  getProduct() {
    this.ckService.getProduct(this.productId).subscribe(
      res => {
        console.log(res);
      },
      error => {
        throw error;
      }
    );
  }

  checkout(_id) {
    this.dataService.pq_variantId = _id;
    return this.router.navigate(['apertura']);
  }

}
