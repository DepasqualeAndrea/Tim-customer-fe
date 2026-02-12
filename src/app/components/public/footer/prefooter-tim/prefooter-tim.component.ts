import {Component, OnInit} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../../../../modules/preventivatore/preventivatore-dynamic/components/preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-prefooter-tim',
  templateUrl: './prefooter-tim.component.html',
  styleUrls: ['./prefooter-tim.component.scss']
})
export class PrefooterTimComponent extends PreventivatoreAbstractComponent implements OnInit {

  emitActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  ngOnInit() {
  }

}
