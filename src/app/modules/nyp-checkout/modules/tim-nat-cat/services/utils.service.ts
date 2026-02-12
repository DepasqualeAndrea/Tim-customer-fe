import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  isNypPrivateArea: boolean;

  constructor() { }

  setNypPrivateArea(val: boolean) {
    return this.isNypPrivateArea = val;
  }

  getNypPrivateArea(): boolean {
    return this.isNypPrivateArea;
  }
}
