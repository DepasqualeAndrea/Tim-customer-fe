import {ContentItem, DeliveryClient, IDeliveryClientConfig, IDeliveryClientProxyConfig, IProxyUrlData, TypeResolver} from 'kentico-cloud-delivery';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LandingPage} from '../models/landing-page.model';
import {AngularLink} from '../models/angular-link.model';
import {Assistance} from '../models/contact-faq.model';
import {Tab, TabCard} from '../models/tab.model';
import {Accordion, AccordionYolo} from '../models/accordion.model';
import {Column, ColumnImage, Row} from '../models/row-col.model';
import {PageLayout} from '../models/page-layout.model';
import {SectionOverview} from '../models/section-overview.model';
import {Architecture, Architecture_api} from '../models/architecture.model';
import {Functionalities} from '../models/functionalities.model';
import {Solutions} from '../models/solutions.model';
import {Card, Cards, YoloButton} from '../models/card.model';
import {YoloCarouselItem} from '../models/homepage-yolo-carousel-item.model';
import {Team} from '../models/ilteam.model';
import {PageModel, PageSectionModel} from '../models/page.model';
import {ListItemModel, ListModel} from '../models/list.model';
import {ImageLink} from '../models/image.model';
import {Guarantees} from 'app/modules/kentico/models/guarantees.model';
import {AccessLogo} from 'app/modules/kentico/models/logo.model';
import {HREFButton} from 'app/modules/kentico/models/button.model';
import {Preventivatore} from '../models/preventivatore.model';
import {KenticoConfigurator} from '../kentico-configurator.service';
import {REMOVE_GUEST_TOKEN} from 'app/core/models/token-interceptor.model';
import {TokenService} from 'app/core/services/token.service';

class LinkedItemResolver {
  linkedItemWrapperTag: string;
  constructor() {
    this.linkedItemWrapperTag = 'div';
  }
}
class DeliveryClientConfig  implements IDeliveryClientConfig{
  projectId: string = null;
  previewApiKey: string = null;
  globalQueryConfig: object = null;
  typeResolvers: TypeResolver[] = [];
  linkedItemResolver: LinkedItemResolver = new LinkedItemResolver();
  proxy?: IDeliveryClientProxyConfig;
}

export abstract class KenticoAbstractService {
  protected deliveryClient: DeliveryClient;
  protected kentico_token: string;

  protected contentsTypeResolvers: TypeResolver[] = [
    new TypeResolver('preventivatore', () => new Preventivatore()),
    new TypeResolver('landing_page', () => new LandingPage()),
    new TypeResolver('angular_link_b527c22', () => new AngularLink()),
    new TypeResolver('assistenza', () => new Assistance()),
    new TypeResolver('tab', () => new Tab()),
    new TypeResolver('tab_card', () => new TabCard()),
    new TypeResolver('accordion', () => new Accordion()),
    new TypeResolver('row', () => new Row()),
    new TypeResolver('column', () => new Column()),
    new TypeResolver('columnimage', () => new ColumnImage()),
    new TypeResolver('page_layout', () => new PageLayout()),
    new TypeResolver('section', () => new SectionOverview()),
    new TypeResolver('section', () => new Architecture()),
    new TypeResolver('section', () => new Architecture_api()),
    new TypeResolver('section', () => new Functionalities()),
    new TypeResolver('section', () => new Solutions()),
    new TypeResolver('yolobutton', () => new YoloButton()),
    new TypeResolver('yolohomepage_carouselitem', () => new YoloCarouselItem()),
    new TypeResolver('staff_page', () => new Team()),
    new TypeResolver('page', () => new PageModel()),
    new TypeResolver('page_section', () => new PageSectionModel()),
    new TypeResolver('list', () => new ListModel()),
    new TypeResolver('list_items', () => new ListItemModel()),
    new TypeResolver('card', () => new Card()),
    new TypeResolver('cards', () => new Cards()),
    new TypeResolver('imagelink', () => new ImageLink()),
    new TypeResolver('consiglio_amministrazione_yolo_group', () => new Card()),
    new TypeResolver('accordionyolo', () => new AccordionYolo()),
    new TypeResolver('guaranteescard', () => new Guarantees()),
    new TypeResolver('href_button', () => new HREFButton()),
    new TypeResolver('logo', () => new AccessLogo()),
  ];
  private static tokenService: TokenService;

  public static initTokenService(tokenService: TokenService) {
    KenticoAbstractService.tokenService = tokenService;
  }

  constructor(
    protected kenticoTenantConfigurator: KenticoConfigurator,
    protected apiKey: string,
    protected resolvers: TypeResolver[],
    protected previewApiKey: string,
    protected usePreviewMode: boolean
  ) {
    this.resolvers = this.resolvers || this.contentsTypeResolvers || [];
    this.initializeToken().then(() => {
      this.deliveryClient = this.initDeliveryClient();
    });
  }

  private async initializeToken(): Promise<void> {
    try {
      if (!KenticoAbstractService.tokenService) {
        this.kentico_token = localStorage.getItem('kentico_token') || localStorage.getItem('token');
        return;
      }
      await KenticoAbstractService.tokenService.ensureValidToken(); //check se il token è valido, altrimenti rigeneralo
      this.kentico_token = KenticoAbstractService.tokenService.getKenticoToken();
      if (!this.kentico_token) {
        throw new Error('Token non disponibile dopo il refresh');
      }
    } catch (error) {
      console.error('Errore durante l\'inizializzazione del token:', error);
      REMOVE_GUEST_TOKEN();
      throw error;
    }
  }

  protected initDeliveryClient(): DeliveryClient {
    if (!this.kentico_token) {
      throw new Error('Token non inizializzato');
    }

    const proxy = {
      advancedProxyUrlResolver: (data: IProxyUrlData) => {
        const action = data.action.replace("/items/", "");

        data.queryConfig.customHeaders = [
          {
            header: 'accept',
            value: 'application/json'
          },
          {
            header: 'Authorization',
            value: `Bearer ${this.kentico_token}`
          }
        ]
        return `/cms-items/${action}`;
      },
    }
    
    const config: DeliveryClientConfig = new DeliveryClientConfig();
    config.proxy = proxy;
    return new DeliveryClient(config);
  }

  listItems<T extends ContentItem>(contentTypeId: string): Observable<T[]> {
    return new Observable(observer => {
      this.ensureValidClientAndToken().then(() => {
        const language: string = this.kenticoTenantConfigurator.getLanguage();
        this.deliveryClient.items<T>()
          .languageParameter(language)
          .type(contentTypeId)
          .toObservable()
          .pipe(map(response => response.items))
          .subscribe(
            items => observer.next(items),
            error => this.handleApiError(error, observer)
          );
      }).catch(error => this.handleApiError(error, observer));
    });
  }

  getItem<T extends ContentItem>(contentItemId: string): Observable<T> {
    return new Observable(observer => {
      this.ensureValidClientAndToken().then(() => {
        const language: string = this.kenticoTenantConfigurator.getLanguage();
        this.deliveryClient.item<T>(contentItemId)
          .languageParameter(language)
          .depthParameter(10)
          .toObservable()
          .pipe(map(response => response.item))
          .subscribe(
            item => observer.next(item),
            error => this.handleApiError(error, observer)
          );
      }).catch(error => this.handleApiError(error, observer));
    });
  }

  private async ensureValidClientAndToken(): Promise<void> {
    try {
      if (!this.deliveryClient) {
        this.deliveryClient = this.initDeliveryClient();
      }
      
      if (!KenticoAbstractService.tokenService) {
        if (!this.kentico_token) {
          this.kentico_token = localStorage.getItem('kentico_token') || localStorage.getItem('token');
        }
        return;
      }
  
      await KenticoAbstractService.tokenService.ensureValidToken();
      const newToken = KenticoAbstractService.tokenService.getKenticoToken();
      
      if (newToken !== this.kentico_token) {
        this.kentico_token = newToken;
        this.deliveryClient = this.initDeliveryClient();
      }
    } catch (error) {
      console.error('Errore durante il refresh del token:', error);
      throw error;
    }
  }

  private handleApiError(error: any, observer: any): void {
    // if (error.status === 401) {
    //   if (KenticoAbstractService.tokenService) {
    //     KenticoAbstractService.tokenService.removeTokens();
    //   }
    //   REMOVE_GUEST_TOKEN();
    // }
    REMOVE_GUEST_TOKEN();
    localStorage.removeItem("kentico_token");
    observer.error(error);
    location.reload();
  }

  filterItem<T extends ContentItem>(items: any, filterBy: string): T {
    return Object.keys(items).filter(i => i.startsWith(filterBy)).reduce(
      (prev, current) => {
        (prev as ContentItem)[current] = items[current];
        return prev;
      }, {} as T);
  }
}
