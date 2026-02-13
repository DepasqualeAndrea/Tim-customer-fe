import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-preventivatore-discount-code-abstract',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './preventivatore-discount-code-abstract.component.html',
    styleUrls: ['./preventivatore-discount-code-abstract.component.scss'],
    standalone: false
})
export class PreventivatoreDiscountCodeAbstractComponent implements OnChanges {
  private _data: any = null;
  @Input()
  set data(data: any) {
    const detectChanges = !!data && !(data === this.data);
    this._data = data;
    if (detectChanges) {
      this.ngOnChanges();
      this.ref.detectChanges();
    }
  }
  get data(): any { return this._data; }
  @Output() actionEvent = new EventEmitter<any>();

  constructor(private ref: ChangeDetectorRef) {
  }
  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  ngOnChanges() {

  }
}
