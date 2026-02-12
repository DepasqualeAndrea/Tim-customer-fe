import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ComponentDataFactory } from './component-data-factory.model';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from '../../preventivatore.module';
import { PreventivatoreDiscountCodeContentProviderService } from './content/preventivatore-discount-code-content-provider-service';
import { PreventivatoreDiscountCodeContentProvider } from './content/preventivatore-discount-code-content-provider.interface';
import { PreventivatoreDiscountCodeComponentProvider } from './product-components/preventivatore-discount-code-component-provider.interface';
import { PreventivatoreDiscountCodeComponentsProviderService } from './product-components/preventivatore-discount-code-components-provider.service';
import { ContentInterface } from './content/content-interface';


@Injectable({
  providedIn: 'root'
})
export class PreventivatoreDiscountCodeProviderService {
  private contentProvider: PreventivatoreDiscountCodeContentProvider;
  private componentProvider: PreventivatoreDiscountCodeComponentProvider;
  private howWorksComponentSubject = new Subject<ComponentDataFactory>();
  private bgImgHeroDCComponentSubject = new Subject<ComponentDataFactory>();
  private whatToKnowComponentSubject = new Subject<ComponentDataFactory>();
  private howWorksComponent$ = this.howWorksComponentSubject.asObservable();
  private bgImgHeroDCComponent$ = this.bgImgHeroDCComponentSubject.asObservable();
  private whatToKnowComponent$ = this.whatToKnowComponentSubject.asObservable();

  constructor(
    private contentProviderService: PreventivatoreDiscountCodeContentProviderService,
    private componentsProviderService: PreventivatoreDiscountCodeComponentsProviderService) {
  }

  getBgImgHeroDCComponentFactory(): Observable<ComponentDataFactory> {
    return this.bgImgHeroDCComponent$;
  }

  getHowWorksComponentFactory(): Observable<ComponentDataFactory> {
    return this.howWorksComponent$;
  }

  getWhatToKnowComponentFactory(): Observable<ComponentDataFactory> {
    return this.whatToKnowComponent$;
  }

  getContent(productCodes: string[]) {
    this.componentProvider = this.componentsProviderService.getProvider(productCodes);
    this.contentProvider = this.contentProviderService.getProvider(productCodes);
    this.contentProvider.getContent(productCodes).pipe(take(1)).subscribe(content => {
      this.processContent(content);
    }
    );
  }

  private processContent(content: ContentInterface) {
    const howWorksContent = this.getHowWorksDCContent(content);
    const bgImgHeroContent = this.getBgImgHeroDCContent(content);
    const whatToKnowContent = this.getWhatToKnowDCContent(content);
    this.createHowWorksComponent(howWorksContent, this.componentProvider);
    this.createBgImgComponent(bgImgHeroContent, this.componentProvider);
    this.createWhatToKnowComponent(whatToKnowContent, this.componentProvider);
  }

  private getBgImgHeroDCContent(content: ContentInterface) {
    return content.bg_img_hero;
  }

  private getHowWorksDCContent(content: ContentInterface) {
    return content.how_works;
  }

  private getWhatToKnowDCContent(content: ContentInterface) {
    return content.what_to_know;
  }

  private createBgImgComponent(content: any, componentProvider: PreventivatoreDiscountCodeComponentProvider) {
    if (content) {
      const component = componentProvider.getBgImgHeroDCComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.bgImgHeroDCComponentSubject.next(componentDataFactory);
      }
    }
  }

  private createHowWorksComponent(content: any, componentProvider: PreventivatoreDiscountCodeComponentProvider) {
    if (content) {
      const component = componentProvider.getHowWorksComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.howWorksComponentSubject.next(componentDataFactory);
      }
    }
  }

  private createWhatToKnowComponent(content: any, componentProvider: PreventivatoreDiscountCodeComponentProvider) {
    if (content) {
      const component = componentProvider.getWhatToKnowComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.whatToKnowComponentSubject.next(componentDataFactory);
      }
    }
  }

}
