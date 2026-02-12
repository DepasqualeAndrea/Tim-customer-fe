import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-how-works-cards',
  templateUrl: './how-works-cards.component.html',
  styleUrls: ['./how-works-cards.component.scss']
})
export class HowWorksCardsComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(public dataService: DataService, ref: ChangeDetectorRef) {
    super(ref)
  }

  ngOnInit() {
  }

}
