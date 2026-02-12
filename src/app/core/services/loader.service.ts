import {Injectable} from '@angular/core';
import {BlockUIService} from 'ng-block-ui';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(
    public blockUIService: BlockUIService
  ) {
  }

  loader: any;

  start(target: string, message?: string): void {
    document.body.style.overflow = 'hidden';
    this.blockUIService.start(target, message);
  }

  stop(target: string): void {
    document.body.style.overflow = 'auto';
    this.blockUIService.stop(target);
  }

  reset(target: string, message?: string): void {
    this.blockUIService.reset(target);
  }

  setTypeLoader(loader: object): void {
    this.loader = loader;
  }

  getTypeLoader() {
    return this.loader;
  }

}
