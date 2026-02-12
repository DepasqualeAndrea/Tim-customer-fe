import {Component, OnInit} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-optional-warranty',
  templateUrl: './optional-warranty.component.html',
  styleUrls: ['./optional-warranty.component.scss']
})
export class OptionalWarrantyComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

}
