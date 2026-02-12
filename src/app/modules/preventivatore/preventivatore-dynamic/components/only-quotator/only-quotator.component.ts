import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-only-quotator',
  templateUrl: './only-quotator.component.html',
  styleUrls: ['./only-quotator.component.scss']
})
export class OnlyQuotatorComponent  extends PreventivatoreAbstractComponent implements OnInit {


  ngOnInit() {
  }
  sendActionEvent(action: any) {

    this.actionEvent.next(action);

  }
}
