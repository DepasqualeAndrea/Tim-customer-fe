import { Injectable, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InjectableProviderService {

  overridenServicesMap = new Map<Type<any>, (...deps: any[]) => any>();

  buildService<T>(type: Type<T>, ...injections: any[]): T {
    const overriden = this.overridenServicesMap.get(type);
    if (overriden) {
      return this.overridenServicesMap.get(type)(...injections);
    }
    return null;
  }

  override<T>(type: Type<T>, factory: (...injections: any[]) => T) {
    this.overridenServicesMap.set(type, factory);
  }
}
