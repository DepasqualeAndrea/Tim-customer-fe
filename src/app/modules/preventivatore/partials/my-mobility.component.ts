import { PreventivatoreComponent } from 'app/modules/preventivatore/preventivatore/preventivatore.component';
import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-my-mobility',
    templateUrl: './my-mobility.component.html',
    styleUrls: ['../preventivatoreY.component.scss'],
    standalone: false
})
export class MyMobilityComponent extends PreventivatoreComponent implements OnInit {

  @Input() product;

  dayList = [
    {value: 1, active: true},
    {value: 3, active: false},
    {value: 7, active: false}
  ];

  image;
  tomorrow;
  transportCollapsed = true;
  transports: Array<{ id: number, value: string }> = [];
  transportValues: Array<{ id: number, value: string }>;

  ngOnInit() {
    this.tomorrow = moment().add(1, 'd');
    this.transportValues = [
      {id: 1, value: 'La tua auto'},
      {id: 2, value: 'Car sharing'},
      {id: 3, value: 'Taxi e car pooling'},
      {id: 4, value: 'La tua moto'},
      {id: 5, value: 'Scooter sharing'},
      {id: 6, value: 'La tua bicicletta'},
      {id: 7, value: 'Bike sharing'},
      {id: 8, value: 'Treno'},
      {id: 9, value: 'Traghetto'}
    ];
  }

  setSelectedDay(day: { value: number, active: boolean }) {
    this.dayList.forEach(d => d.active = d === day);
  }

  transportLabels(transports: Array<{ id: number, value: string }>) {
    let placeholder: string;
    this.kenticoTranslateService.getItem<any>('quotator.transport_means_select').subscribe(text => { placeholder = text.value; });
    return transports.map(t => t.value).join(', ') || placeholder;
  }

  toggleTransport() {
    this.transportCollapsed = !this.transportCollapsed;
  }

  toggleTransportValue(event: any, transport: { id: number, value: string }) {
    if (event.target.checked) {
      this.transports.push(transport);
    } else {
      this.transports.splice(this.transports.indexOf(transport), 1);
    }
  }

  createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            quantity: 1,
            insurance_info_attributes: {
              transport_ids: this.transports.map(t => t.id),
            },
            start_date: this.tomorrow.format('DD/MM/YYYY'),
            expiration_date: this.tomorrow.add(this.dayList.find(d => d.active).value, 'd').format('DD/MM/YYYY')
          },
        },
      }
    };
  }

  checkout() {
    const order = this.createOrderObj(this.product.master_variant);
    this.checkoutService.addToChart(order).subscribe(res => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      this.dataService.setRequestOrder(order);
      return this.router.navigate(['apertura']);
    });
  }
}
