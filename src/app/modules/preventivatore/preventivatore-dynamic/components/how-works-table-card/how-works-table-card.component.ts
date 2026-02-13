import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-how-works-table-card',
    templateUrl: './how-works-table-card.component.html',
    styleUrls: ['./how-works-table-card.component.scss'],
    standalone: false
})
export class HowWorksTableCardComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(ref: ChangeDetectorRef, public dataService: DataService) {
    super(ref);
  }

  ngOnInit() {
  }

  changePreventivatore(productCode: string) {
    this.dataService.setPreventivatoreProduct(productCode);
  }
}
