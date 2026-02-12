import {Component, OnInit} from '@angular/core';
import { Product } from '@model';
import {GtmService} from '../../../../core/services/gtm/gtm.service';
import {CbGtmAction} from '../../../../core/models/gtm/cb/cb-gtm-action.model';

@Component({
  selector: 'app-header-thema-cb',
  templateUrl: './themaCB.component.html',
  styleUrls: ['../../../preventivatore/preventivatoreCB.component.scss', './themaCB.component.scss'],
})
export class HeaderThemaCBComponent implements OnInit {

  product;

  constructor() {}

  ngOnInit() {
  }

  handleGtm(service: GtmService) {
    const action: CbGtmAction = new CbGtmAction('homeEvent', 'click fai un preventivo', 'Protezione Casa');
    service.reset();
    service.add(action);
    service.push();
  }
}
