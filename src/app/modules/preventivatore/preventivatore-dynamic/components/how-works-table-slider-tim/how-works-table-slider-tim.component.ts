import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-how-works-table-slider-tim',
    templateUrl: './how-works-table-slider-tim.component.html',
    styleUrls: ['./how-works-table-slider-tim.component.scss'],
    standalone: false
})
export class HowWorksTableSliderTimComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

  emitActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
