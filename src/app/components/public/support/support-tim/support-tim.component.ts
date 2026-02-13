import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@model';
import { AuthService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-support-tim',
  templateUrl: './support-tim.component.html',
  styleUrls: ['./support-tim.component.scss'],
  standalone: false
})
export class SupportTimComponent implements OnInit {

  support: any;
  tagsBoxEnabled: string[] = [];

  constructor(
    private router: Router,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getIdProduct()
    this.loadContent();
  }

  getIdProduct(): void {
    this.componentFeaturesService.useComponent('assistance');
    const faqListRule = this.getFaqListRule(this.auth.loggedUser)
    this.componentFeaturesService.useRule(faqListRule);
    this.tagsBoxEnabled = this.componentFeaturesService.getConstraints().get('tags') || [];
  }

  filterProductIdEnabled(products: any[]): any[] {
    const filteredIds = products.filter(product =>
      this.tagsBoxEnabled.find(tag =>
        product.id === tag
      )
    )
    return filteredIds
  }

  loadContent() {
    this.kenticoTranslateService.getItem<any>('support').pipe(take(1)).subscribe(item => {
      const support = {
        header: {
          title: item.landing_title.value,
          subtitle: item.landing_subtitle.value
        },
        content: {
          title: item.product_list_title.value,
          products: item.product_list.value.map(i => {
            return {
              id: i.name.value.toLowerCase().replace(/\W/gm, '-'),
              name: i.name.value,
              link: item.button_cta.value
            };
          })
        }
      };
      const idFilterEnabled = this.filterProductIdEnabled(support.content.products)
      support.content.products = idFilterEnabled
      this.support = Object.assign({}, support)
    })
  }

  private getFaqListRule(user: User): string {
    return 'assistance-box-enabled';
  }
}
