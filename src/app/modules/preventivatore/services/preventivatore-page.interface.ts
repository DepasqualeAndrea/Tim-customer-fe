import {Product} from '@model';

export interface PreventivatorePage {
  products: Product[];
  productCodes: string[];

  initializePreventivatore();
}
