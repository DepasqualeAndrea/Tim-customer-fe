import { Observable } from 'rxjs';
import { ContentInterface } from './content-interface';

export interface PreventivatoreContentProvider {
  getContent(code: string[]): Observable<ContentInterface>;
}
