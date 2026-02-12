import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';


@Directive()
@Injectable()
export class SharingDataService {

  reportDisabled = true;
  @Output() setReportDisabled: EventEmitter<any> = new EventEmitter();
  @Output() activeTab: EventEmitter<any> = new EventEmitter();
  @Output() activeTabClaims: EventEmitter<any> = new EventEmitter();


  private dataSource = new BehaviorSubject<any>([]);
  currentData = this.dataSource.asObservable();

  constructor() { }

  changeMessage(input: any) {
    this.dataSource.next(input);
  }

  setIsReportDisabled(params, nameTab?: string) {
    this.setReportDisabled.emit({ params, nameTab });
  }

  setActiveTab(_activeTab: boolean) {
    this.activeTab.emit(_activeTab);
  }
  setActiveTabClaims(_activeTabClaims: boolean) {
    this.activeTabClaims.emit(_activeTabClaims);
  }


}
