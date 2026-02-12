import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManageDataService {
  value: boolean;

  constructor() { }
  setValue(val) {
    this.value = val;
  }

  getValue() {
    return this.value;

  }
}
