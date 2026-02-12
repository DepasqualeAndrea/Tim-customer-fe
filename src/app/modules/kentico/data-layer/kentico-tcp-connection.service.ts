import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {KenticoConfigurator} from '../kentico-configurator.service';

@Injectable({
  providedIn: 'root'
})
export class KenticoTcpConnectionService {
  private opened_connections: number = 0;
  private waiting_connections: Subject<any>[] = [];

  constructor(private kenticoConfigurator: KenticoConfigurator) {
  }

  private openConnection(): boolean {
    if(this.connectionAvailable()) {
      this.opened_connections++;
      return true;
    } else {
      return false;
    }
  }
  private closeConnection() {
    if(this.opened_connections > 0)
      this.opened_connections--;

    const waitingConnection: Subject<any> = this.waiting_connections.pop();
    if(!!waitingConnection) {
      // start a new request if exists
      waitingConnection.next();
    }
  }

  private connectionAvailable(): boolean {
    const maxConnections: number = this.kenticoConfigurator.getMaxConnections();
    return maxConnections === 0 || this.opened_connections < this.kenticoConfigurator.getMaxConnections();
  }

  /**
   * Allows to define an observable than resolves input observable once a connection as been closed
   * @param getItem
   */
  private waitConnectionFor(getItem: Observable<any>): Observable<any> {
    const subj: Subject<any> = new Subject<any>();
    const obs: Observable<any> = subj.asObservable();
    this.waiting_connections.push(subj);

    return obs.pipe(
      switchMap(() => this.request(getItem))
    )
  }

  /**
   * send an observable to tcpManager: if there are connections available, then open one and return the observable piped with a close connection
   * if no connection are available return an observable that will re-execute request method once a connection closes
   * @param getItem
   */
  request(getItem:Observable<any>): Observable<any> {
    if(this.openConnection()) {
      return getItem.pipe(tap(() => this.closeConnection()));
    } else {
      return this.waitConnectionFor(getItem);
    }
  }



}
