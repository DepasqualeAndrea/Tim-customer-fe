import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsServiceCyber {

  isNypPrivateArea: boolean;

  constructor() { }

  setNypPrivateArea(val: boolean) {
    return this.isNypPrivateArea = val;
  }

  getNypPrivateArea(): boolean {
    return this.isNypPrivateArea;
  }
}