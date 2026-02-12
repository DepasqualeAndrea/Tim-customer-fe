import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {PreventivatoreComponent} from '../preventivatore/preventivatore.component';
import { NgForm } from '@angular/forms';
import {GtmService} from '../../../core/services/gtm/gtm.service';
import {CbGtmAction} from '../../../core/models/gtm/cb/cb-gtm-action.model';


@Component({
  selector: 'app-motor-cb',
  templateUrl: './motor-cb.component.html',
  styleUrls: ['../preventivatoreCB.component.scss']
})
export class MotorCbComponent extends PreventivatoreComponent implements OnInit {

  @Input() product: any;
  vehicle: any;

  ngOnInit() {

  }


  handleGtm(service: GtmService) {
    const action = new CbGtmAction('motorEvent', 'click fai un preventivo', 'Protezione Motor');
    service.reset();
    service.add(action);
    service.push();
  }
}
