import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-how-works-double-col-no-table',
    templateUrl: './how-works-double-col-no-table.component.html',
    styleUrls: ['./how-works-double-col-no-table.component.scss'],
    standalone: false
})
export class HowWorksDoubleColNoTableComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(ref: ChangeDetectorRef) { 
    super(ref);
  }

  ngOnInit() {
  }

}
