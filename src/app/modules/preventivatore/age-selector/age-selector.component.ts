import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AgeSelection} from './age-selector.model';
import {DataService} from '@services';

@Component({
    selector: 'app-age-selector',
    templateUrl: './age-selector.component.html',
    styleUrls: ['./age-selector.component.scss'],
    standalone: false
})
export class AgeSelectorComponent implements OnInit {

  @Input() ageList: AgeSelection[];

  @Input() maxInsured: number;

  @Input() productCode: string = '';

  @Output() update: EventEmitter<AgeSelection> = new EventEmitter<AgeSelection>();

  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();


  constructor(public dataService: DataService) {
  }

  ngOnInit() {
  }

  subtractQuantity(ageSelection: AgeSelection) {
    this.updateQuantity(ageSelection, ageSelection.quantity - 1);
  }

  addQuantity(ageSelection: AgeSelection) {
    this.updateQuantity(ageSelection, ageSelection.quantity + 1);
  }

  applyQuantities() {
    this.confirm.emit();
  }

  maxInsuredRiched() {
    return this.ageList.reduce((acc, curr) => acc + curr.quantity, 0) >= this.maxInsured;
  }

  private updateQuantity(ageSelection: AgeSelection, quantity: number) {
    this.update.emit(Object.assign({}, ageSelection, {quantity}));
  }

}
