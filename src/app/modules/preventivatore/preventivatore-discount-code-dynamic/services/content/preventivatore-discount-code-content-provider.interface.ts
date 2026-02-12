import { Observable } from 'rxjs';
import { ContentInterface } from './content-interface';

export interface PreventivatoreDiscountCodeContentProvider {

  getContent(code: string[]): Observable<ContentInterface>;

}
