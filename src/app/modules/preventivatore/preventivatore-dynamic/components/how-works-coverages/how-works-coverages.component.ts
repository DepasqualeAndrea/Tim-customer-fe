import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-how-works-coverages',
  templateUrl: './how-works-coverages.component.html',
  styleUrls: ['./how-works-coverages.component.scss']
})
export class HowWorksCoveragesComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(ref: ChangeDetectorRef) {
    super(ref);
   }

  ngOnInit() {
  }

}
