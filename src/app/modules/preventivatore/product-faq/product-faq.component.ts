import { DataService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-product-faq',
  templateUrl: './product-faq.component.html',
  styleUrls: ['./product-faq.component.scss']
})
export class ProductFaqComponent implements OnInit, OnDestroy {

  isEnabled = false;
  hasFaqs = false;
  data = <{
    title: string;
    faqs: any[];
    collapse_toggler_show: string;
    collapse_toggler_hide: string;
  }>{};
  @Input() products;

  constructor(
    private componentFeaturesService: ComponentFeaturesService,
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.componentFeaturesService.useComponent('product-faq');
    this.componentFeaturesService.useRule('show-section');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const productCode: string = this.products[0].product_code;
      const constraints = this.componentFeaturesService.getConstraints();
      const key = Array.from(constraints.keys()).find(k => productCode.startsWith(k));
      const value = constraints.get(key);
      if (value && value.visible) {
        this.isEnabled = value.visible;
        const codename = value.codename;
        this.kenticoTranslateService.getItem('frequent_questions').pipe(untilDestroyed(this)).subscribe((item: any) => this.data.title = item.text.value);
        this.kenticoTranslateService.getItem(codename).pipe(untilDestroyed(this)).subscribe((kenticoItem: any) => {
          const faqsFromKentico: any[] = kenticoItem.linked_items.value.map(item => {
            return {
              question: item.question.value,
              answer: item.answer.value
            };
          });
          const fullLength = faqsFromKentico.length;
          this.hasFaqs = fullLength > 0;
          const halfLength = Math.ceil(fullLength / 2);
          const leftSideFaqs = faqsFromKentico.slice(0, halfLength);
          const rightSideFaqs = faqsFromKentico.slice(halfLength, fullLength);
          const faqs = [leftSideFaqs, rightSideFaqs];
          this.data.faqs = faqs;
        });
        this.kenticoTranslateService.getItem('accordion_closed.image').pipe(untilDestroyed(this)).subscribe((item: any) => this.data.collapse_toggler_show = item.value[0].url);
        this.kenticoTranslateService.getItem('accordion_open.image').pipe(untilDestroyed(this)).subscribe((item: any) => this.data.collapse_toggler_hide = item.value[0].url);
      }
    }
  }

  ngOnDestroy(): void {
  }

}
