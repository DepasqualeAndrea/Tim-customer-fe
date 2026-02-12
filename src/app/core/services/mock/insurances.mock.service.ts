import { Observable } from 'rxjs';
import { InsurancesService } from '../insurances.service';

export class InsurancesMockService extends InsurancesService {

  getProducts(): Observable<any> {
    throw new Error("getProducts")
  }
}

