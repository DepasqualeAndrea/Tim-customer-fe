import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-how-works-telemedicina',
    templateUrl: './how-works-telemedicina.component.html',
    styleUrls: ['./how-works-telemedicina.component.scss'],
    standalone: false
})
export class HowWorksTelemedicinaComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(public dataService: DataService, ref: ChangeDetectorRef) {
    super(ref);
  }

  ngOnInit() {
  }

}
