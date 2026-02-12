import { Observable, of } from 'rxjs';
import { ProductsList } from '@model';
export class InsuranceServiceMockTutelaLegale {
    getProducts(): Observable<ProductsList> {
        const productList: ProductsList = {
            products: [
                // PRODUCT_TUTELA_LEGALE
            ],
            count: 1,
            total_count: 1,
            current_page: 1,
            per_page: 10,
            pages: 1
        };
        return of(productList);
    }
}
