import { Observable } from 'rxjs';
import { BusinessFormCountry } from './business-form-country.model';
import { BusinessFormState } from './business-form-state.model';
import { BusinessFormCity } from './business-form-city.model';

export interface BusinessFormCountryService {
    getDefaultCountry(): Observable<BusinessFormCountry>;
    getProvince(countryId: number): Observable<BusinessFormState[]>;
    getCities(stateId: number): Observable<BusinessFormCity[]>;
}

