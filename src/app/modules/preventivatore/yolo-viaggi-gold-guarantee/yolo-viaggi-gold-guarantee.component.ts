import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { DataService } from '@services';
import {PreventivatoreAbstractComponent} from '../preventivatore-dynamic/components/preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-yolo-viaggi-gold-guarantee',
    templateUrl: './yolo-viaggi-gold-guarantee.component.html',
    styleUrls: ['./yolo-viaggi-gold-guarantee.component.scss'],
    standalone: false
})
export class YoloViaggiGoldGuaranteeComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(
    public dataService: DataService,
    ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  ngOnInit(): void {
  }

}
