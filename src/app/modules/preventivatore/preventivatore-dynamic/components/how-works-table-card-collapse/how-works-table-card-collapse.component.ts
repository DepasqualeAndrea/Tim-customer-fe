import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-how-works-table-card-collapse',
  templateUrl: './how-works-table-card-collapse.component.html',
  styleUrls: ['./how-works-table-card-collapse.component.scss']
})
export class HowWorksTableCardCollapseComponent extends PreventivatoreAbstractComponent implements OnInit {

  selectedSlider: string;

  constructor(ref: ChangeDetectorRef, public dataService: DataService) {
    super(ref);
  }

  ngOnInit() {
    this.setSelectedSlider();
  }

  setSelectedSlider() {
    const product_code = this.data.product_content?.find(item =>
      item?.product_code === 'winter-sport-premium'
      || item?.product_code === 'ge-ski-premium'
      || item?.product_code === 'yolo-for-ski-gold').product_code;
    this.changeSelectedSlider(product_code);
  }

  changeSelectedSlider(product_code: string) {
    this.selectedSlider = product_code;
  }
}
