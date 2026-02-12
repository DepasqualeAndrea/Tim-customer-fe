import { Observable, Subject } from 'rxjs';
import { ContentInterface } from './content/content-interface';
import { take } from 'rxjs/operators';
import { ComponentDataFactory } from './component-data-factory.model';
import { Injectable } from '@angular/core';
import { PreventivatoreModule } from '../../preventivatore.module';
import { PreventivatoreContentProvider } from './content/preventivatore-content-provider.interface';
import { PreventivatoreContentProviderService } from './content/preventivatore-content-provider-service';
import { PreventivatoreComponentProvider } from './product-components/preventivatore-component-provider.interface';
import { PreventivatoreComponentsProviderService } from './product-components/preventivatore-components-provider.service';


@Injectable({
  providedIn: 'root'
})
export class PreventivatoreProviderService {
  private contentProvider: PreventivatoreContentProvider;
  private componentProvider: PreventivatoreComponentProvider;
  private headerComponentSubject = new Subject<ComponentDataFactory>();
  private howWorksComponentSubject = new Subject<ComponentDataFactory>();
  private moreInfoComponentSubject = new Subject<ComponentDataFactory>();
  private whatToKnowComponentSubject = new Subject<ComponentDataFactory>();
  private forWhoComponentSubject = new Subject<ComponentDataFactory>();
  private heroComponentSubject = new Subject<ComponentDataFactory>();
  private bgImgHeroComponentSubject = new Subject<ComponentDataFactory>();
  private headerComponent$ = this.headerComponentSubject.asObservable();
  private howWorksComponent$ = this.howWorksComponentSubject.asObservable();
  private moreInfoComponent$ = this.moreInfoComponentSubject.asObservable();
  private whatToKnowComponent$ = this.whatToKnowComponentSubject.asObservable();
  private forWhoComponent$ = this.forWhoComponentSubject.asObservable();
  private heroComponent$ = this.heroComponentSubject.asObservable();
  private bgImgHeroComponent$ = this.bgImgHeroComponentSubject.asObservable();
  // generic containers
  private component1Subject = new Subject<ComponentDataFactory>();
  private component2Subject = new Subject<ComponentDataFactory>();
  private component3Subject = new Subject<ComponentDataFactory>();
  private component4Subject = new Subject<ComponentDataFactory>();
  private component5Subject = new Subject<ComponentDataFactory>();
  private component6Subject = new Subject<ComponentDataFactory>();
  private component7Subject = new Subject<ComponentDataFactory>();
  private component8Subject = new Subject<ComponentDataFactory>();
  private component1$ = this.component1Subject.asObservable();
  private component2$ = this.component2Subject.asObservable();
  private component3$ = this.component3Subject.asObservable();
  private component4$ = this.component4Subject.asObservable();
  private component5$ = this.component5Subject.asObservable();
  private component6$ = this.component6Subject.asObservable();
  private component7$ = this.component7Subject.asObservable();
  private component8$ = this.component8Subject.asObservable();

  constructor(
    private contentProviderService: PreventivatoreContentProviderService,
    private componentsProviderService: PreventivatoreComponentsProviderService) {
  }

  getHeroComponentFactory(): Observable<ComponentDataFactory> {
    return this.heroComponent$;
  }

  getBgImgHeroComponentFactory(): Observable<ComponentDataFactory> {
    return this.bgImgHeroComponent$;
  }

  getHeaderComponentFactory(): Observable<ComponentDataFactory> {
    return this.headerComponent$;
  }

  getHowWorksComponentFactory(): Observable<ComponentDataFactory> {
    return this.howWorksComponent$;
  }

  getMoreInfoComponentFactory(): Observable<ComponentDataFactory> {
    return this.moreInfoComponent$;
  }

  getWhatToKnowComponentFactory(): Observable<ComponentDataFactory> {
    return this.whatToKnowComponent$;
  }

  getForWhoComponentFactory(): Observable<ComponentDataFactory> {
    return this.forWhoComponent$;
  }

  // for generic containers
  getComponentFactory(index) {
    return this[`component${index}$`];
  }

  // ? should I have a `getAllComponentFactories` method

  getContent(productCodes: string[]) {
    this.componentProvider = this.componentsProviderService.getProvider(productCodes);
    this.contentProvider = this.contentProviderService.getProvider(productCodes);
    this.contentProvider.getContent(productCodes).pipe(take(1)).subscribe(content => {
      this.processContent(content);
    }
    );
  }

  private processContent(content: ContentInterface) {
    const headerContent = this.getHeaderContent(content);
    const howItWorksContent = this.getHowWorksContent(content);
    const moreInfoContent = this.getMoreInfoContent(content);
    const forWhoContent = this.getForWhoContent(content);
    const whatToKnowContent = this.getWhatToKnowInfoContent(content);
    const heroContent = this.getHeroContent(content);
    const bgImgHeroContent = this.getBgImgHeroContent(content);
    this.createHeaderComponent(headerContent, this.componentProvider);
    this.createHowWorksComponent(howItWorksContent, this.componentProvider);
    this.createMoreInfoComponent(moreInfoContent, this.componentProvider);
    this.createForWhoComponent(forWhoContent, this.componentProvider);
    this.createWhatToKnowComponent(whatToKnowContent, this.componentProvider);
    this.createHeroComponent(heroContent, this.componentProvider);
    this.createBgImgComponent(bgImgHeroContent, this.componentProvider);

    // for generic containers
    this.createComponents(content);
  }

  private getHeroContent(content: ContentInterface) {
    return content.hero;
  }

  private getBgImgHeroContent(content: ContentInterface) {
    return content.bg_img_hero;
  }

  private getHeaderContent(content: ContentInterface) {
    return content.header;
  }

  private getHowWorksContent(content: ContentInterface) {
    return content.how_works;
  }

  private getMoreInfoContent(content: ContentInterface) {
    return content.more_info;
  }

  private getWhatToKnowInfoContent(content: ContentInterface) {
    return content.what_to_know;
  }

  private getForWhoContent(content: ContentInterface) {
    return content.for_who;
  }

  // for generic containers
  private getComponentContent(content: ContentInterface, index: number) {
    return content[`container_${index}`];
  }


  private createHeroComponent(content: any, componentProvider: any) {
    if (content) {
      const component = componentProvider.getHeroComponent && componentProvider.getHeroComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.heroComponentSubject.next(componentDataFactory);
      }
    }
  }

  private createBgImgComponent(content: any, componentProvider: any) {
    if (content) {
      const component = componentProvider.getBgImgHeroComponent && componentProvider.getBgImgHeroComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.bgImgHeroComponentSubject.next(componentDataFactory);
      }
    }
  }

  private createHeaderComponent(content: any, componentProvider: any) {
    if (content) {
      const component = componentProvider.getHeaderComponent && componentProvider.getHeaderComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.headerComponentSubject.next(componentDataFactory);
      }
    }
  }

  private createHowWorksComponent(content: any, componentProvider: any) {
    if (content) {
      const component = componentProvider.getHowWorksComponent && componentProvider.getHowWorksComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.howWorksComponentSubject.next(componentDataFactory);
      }
    }
  }

  private createMoreInfoComponent(content: any, componentProvider: any) {
    if (content) {
      const component = componentProvider.getMoreInfoComponent && componentProvider.getMoreInfoComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.moreInfoComponentSubject.next(componentDataFactory);
      }
    }
  }

  private createWhatToKnowComponent(content: any, componentProvider: any) {
    if (content) {
      const component = componentProvider.getWhatToKnowComponent && componentProvider.getWhatToKnowComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.whatToKnowComponentSubject.next(componentDataFactory);
      }
    }
  }

  private createForWhoComponent(content: any, componentProvider: any) {
    if (content) {
      const component = componentProvider.getForWhoComponent && componentProvider.getForWhoComponent();
      if (component) {
        const componentDataFactory = {
          data: content,
          componentFactory: component
        };
        this.forWhoComponentSubject.next(componentDataFactory);
      }
    }
  }

  // for generic containers
  private createComponents(content: any) {
    if (content) {
      const components = this.componentProvider.getComponents();
      if (components) {
        components.forEach((component, i) => {
          const index = i + 1;
          const componentContent = this.getComponentContent(content, index);
          const componentDataFactory = {
            data: componentContent,
            componentFactory: component
          };
          this[`component${index}Subject`].next(componentDataFactory);
        });
      }
    }
  }

}
