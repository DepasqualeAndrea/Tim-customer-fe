import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { DataService } from 'app/core/services/data.service';


@Component({
  selector: 'app-product-found',
  templateUrl: './product-found.component.html',
  styleUrls: ['./product-found.component.scss'],
})
export class ProductFoundComponent implements OnInit {

  @Input() productInformation;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
  }

}
