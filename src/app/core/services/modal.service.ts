import {Injectable} from '@angular/core';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {KenticoTranslateService} from '../../modules/kentico/data-layer/kentico-translate.service';
import {ContainerComponent} from '../../modules/tenants/component-loader/containers/container.component';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    public modalService: NgbModal,
    public kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService
  ) {
  }

  public openModal(kenticoItem: string, modalName: string): void {
    let kenticoContent = {};
    const ngbModalOptions: NgbModalOptions = {size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window'};
    this.kenticoTranslateService.getItem<any>(kenticoItem).pipe().subscribe((item) => {
      kenticoContent = item;
      const modalRef = this.modalService.open(ContainerComponent, ngbModalOptions);
      (<ContainerComponent>modalRef.componentInstance).type = modalName;
      (<ContainerComponent>modalRef.componentInstance).componentInputData = {'kenticoContent': kenticoContent};
    });
  }

  public openModalCentered(kenticoItem: string, modalName: string): void {
    let kenticoContent = {};
    const ngbModalOptions: NgbModalOptions = {size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', backdrop: 'static', keyboard: false, centered: true};
    this.kenticoTranslateService.getItem<any>(kenticoItem).pipe().subscribe((item) => {
      kenticoContent = item;
      const modalRef = this.modalService.open(ContainerComponent, ngbModalOptions);
      (<ContainerComponent>modalRef.componentInstance).type = modalName;
      (<ContainerComponent>modalRef.componentInstance).componentInputData = {'kenticoContent': kenticoContent};
    });
  }

  public openModalRequired(kenticoItem: string, modalName: string): void {
    let kenticoContent = {};
    const ngbModalOptions: NgbModalOptions = {size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', backdrop: 'static', keyboard: false, centered: true};
    this.kenticoTranslateService.getItem<any>(kenticoItem).pipe().subscribe((item) => {
      kenticoContent = item;
      const modalRef = this.modalService.open(ContainerComponent, ngbModalOptions);
      (<ContainerComponent>modalRef.componentInstance).type = modalName;
      (<ContainerComponent>modalRef.componentInstance).componentInputData = {'kenticoContent': kenticoContent};
    });
  }

  public openModalSCA(kenticoItem: string, modalName: string, request: object): void {
    let kenticoContent = {};
    this.kenticoTranslateService.getItem<any>(kenticoItem).pipe().subscribe((item) => {
      kenticoContent = item;
      // @ts-ignore
      const modalRef = this.modalService.open(ContainerComponent, {size: 'md', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', centered: true});
      (<ContainerComponent>modalRef.componentInstance).type = modalName;
      (<ContainerComponent>modalRef.componentInstance).componentInputData = {'kenticoContent': kenticoContent, 'sendRequest': request};
    });
  }

}
