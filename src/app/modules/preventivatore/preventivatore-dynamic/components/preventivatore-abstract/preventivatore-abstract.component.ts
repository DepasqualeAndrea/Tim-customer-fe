import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';

@Component({
    selector: 'app-preventivatore-abstract',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './preventivatore-abstract.component.html',
    styleUrls: ['./preventivatore-abstract.component.scss'],
    standalone: false
})
export class PreventivatoreAbstractComponent implements OnChanges {

  private haveBeenlogged = false;
  private _data: any = null;
  @Input()
  set data(data: any) {
    const detectChanges = !!data && !(data === this.data);
    this._data = data;
    if (detectChanges) {
      this.ngOnChanges();
      this.ref.detectChanges();
    }

    if (!this.haveBeenlogged && !!data.product) {
      this.haveBeenlogged = true;
    }
  }

  get data(): any {
    return this._data;
  }

  @Output() actionEvent = new EventEmitter<any>();

  constructor(private ref: ChangeDetectorRef) {
  }

  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  ngOnChanges() {
  }

}
