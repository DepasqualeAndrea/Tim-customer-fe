import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { ContentItem } from 'kentico-cloud-delivery';

const COMPONENT_FEATURE_NAME = 'modal-opener-directive';
const COMPONENT_FEATURE_RULE = 'by-product-code';

const NGBMODAL_DEFAULT_OPTIONS = {
  size: 'lg',
  backdropClass: 'backdrop-class',
  windowClass: 'modal-window',
  centered: true,
};

type ProductModalMap = {
  [productCode: string]: ModalConfig
};

type ModalConfig = {
  contentCodename: string;
  type: string;
};

@Directive({
  selector: '[open-modal]'
})
export class ModalOpenerDirective implements OnInit {

  /** 
    Use this directive to generate a tooltip that opens a modal and append it to any HTML element
    Configuration must be done in mongoDB's componentFeatures collection, retrieved by componentFeaturesService
    - @property productCode specifies for which products the tooltip will be available
      (if not provided the tooltip will not be displayed, required)
    - @property context is used to define in which part of the platform the tooltip is used
      (note that this has the sole purpose of distinguishing more modals for the same products if there's more than 1, required)
    - @property tooltipClass sets additional class/classes to the tooltip
      (not required)
    - @property ngbModalOptions overrides default modal options for provided properties
      (not required)
    - @property title prevents the tooltip creation and assigns the click event to the parent element
      (not required)
    
    How to use:
    - in your HTML element, put open-modal as a property 
      (EX: <div open-modal></div>)
    - then bind (if needed) and pass productCode and context as strings to the same element
      (EX: <div open-modal [productCode]="your-product-code" context="your-context" ></div>)
  */

  @Input('productCode') productCode: string;
  @Input('context') context: string;
  @Input('tooltipClass') tooltipClass: string;
  @Input('ngbModalOptions') ngbModalOptions: NgbModalOptions;
  @Input('title') title: string;
  @Output() resultModal: EventEmitter<any> = new EventEmitter<any>();

  private inputElement: HTMLElement;
  private tooltip: HTMLElement;
  private productModalMaps: ProductModalMap;

  constructor(
    private el: ElementRef,
    private componentFeaturesService: ComponentFeaturesService,
    private modalService: NgbModal,
    private kenticoTranslateService: KenticoTranslateService
  ) {
    this.inputElement = this.el.nativeElement;
  }

  ngOnInit() {
    if (this.isRuleEnabled() && this.context && this.productCode) {
      const modalConfig: ModalConfig = this.getModalTypeToOpen();
      if (this.hasAllRequiredProperties(modalConfig)) {
        if (this.title) {
          this.inputElement.innerText = this.title;
          this.inputElement.parentElement.addEventListener('click', () => {
            this.openModal(modalConfig);
          });
        } else {
          /*
          this.tooltip = document.createElement('div');
          this.tooltip.id = 'modal-directive-tooltip';
          this.tooltip.classList.add('modal-opener-tooltip');
          if (this.tooltipClass) {
            this.tooltip.classList.add(this.tooltipClass);
          }
          this.tooltip.addEventListener('click', () => {
            this.openModal(modalConfig);
          });
          this.inputElement.parentNode.appendChild(this.tooltip);
          */
        }
      }
    }
  }

  private isRuleEnabled(): boolean {
    this.componentFeaturesService.useComponent(COMPONENT_FEATURE_NAME);
    this.componentFeaturesService.useRule(COMPONENT_FEATURE_RULE);
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.productModalMaps = this.componentFeaturesService.getConstraints().get(this.context);
      const productHasModal = Object.keys(this.productModalMaps).some((code: keyof ProductModalMap) => 
        code === this.productCode
      );
      return productHasModal;
    }
    return false;
  }

  private getModalTypeToOpen(): ModalConfig {
    let productModalConfig: ModalConfig;
    Object.entries(this.productModalMaps).forEach(entry => {
      const productCode: keyof ProductModalMap = entry[0];
      const modalConfig: ProductModalMap[keyof ProductModalMap] = entry[1];
      if (productCode === this.productCode) {
        productModalConfig = modalConfig;
      }
    });
    return productModalConfig;
  }

  private openModal(modalConfig: ModalConfig): void {
    this.kenticoTranslateService.getItem<ContentItem>(modalConfig.contentCodename).pipe().subscribe(item => {
      const modalRef = this.modalService.open(
        ContainerComponent, 
        Object.assign(NGBMODAL_DEFAULT_OPTIONS, this.ngbModalOptions)
      );
      (<ContainerComponent>modalRef.componentInstance).type = modalConfig.type;
      /**
        Modal component must have a @Input() content: ContentItem property 
       */
      (<ContainerComponent>modalRef.componentInstance).componentInputData = {'content': item};
      modalRef.result.then((result) => {

        if(result) {
          this.resultModal.emit(result);
        }
  
      });
    });
  }

  private hasAllRequiredProperties(config: ModalConfig): boolean {
    return config.hasOwnProperty('type') && config.hasOwnProperty('contentCodename');
  }

}
