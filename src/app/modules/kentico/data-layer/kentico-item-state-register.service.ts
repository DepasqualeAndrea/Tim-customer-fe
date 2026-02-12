import {Injectable} from '@angular/core';
import {KenticoItemState} from './kentico-item-state.enum';
import {Observable, Subject} from 'rxjs';
import {KenticoModule} from '../kentico.module';

@Injectable({
  providedIn: 'root'
})
export class KenticoItemStateRegister {

  /* CALL STATES: update some specific content state. allowing to create observables which can notify when a specific item has been got */
  private itemsState: Map<string, KenticoItemState> = new Map<string, KenticoItemState>();
  private itemSubjects: Map<string, Subject<any>> = new Map<string, Subject<any>>();
  private itemObsState: Map<string, Observable<any>> = new Map<string, Observable<any>>();

  setState(itemname: string, state: KenticoItemState = KenticoItemState.ToBeRequested) {
    this.itemsState.set(itemname, state);

    if(state === KenticoItemState.Requested) {
      const subj: Subject<any> = new Subject<any>();
      this.itemSubjects.set(itemname, subj);
      this.itemObsState.set(itemname, subj.asObservable());
    } else if(state === KenticoItemState.Cached) {
      if(this.itemSubjects.has(itemname)) {
        this.itemSubjects.get(itemname).next();
        this.itemSubjects.delete(itemname);
      }
    }
  }

  private getMajor(contentId: string): string {
    const indexOfDot: number = contentId.indexOf('.');
    if(indexOfDot < 0) {
      return contentId;
    } else {
      return contentId.substring(0, indexOfDot);
    }
  }

  getState(itemname: string): KenticoItemState {
    if(!itemname)
      return KenticoItemState.ToBeRequested;     // name not valid

    const major: string = this.getMajor(itemname);

    return this.itemsState.has(major) ? this.itemsState.get(major) : KenticoItemState.ToBeRequested;
  }

  getObservableState(itemname: string): Observable<any> {
    if(!itemname || !this.itemSubjects.has(itemname))
      return null;

    return this.itemObsState.get(itemname);
  }
}
