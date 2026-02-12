import { Observable } from 'rxjs';

export interface CheckoutContentProvider {
    getContent(): Observable<any>;
}