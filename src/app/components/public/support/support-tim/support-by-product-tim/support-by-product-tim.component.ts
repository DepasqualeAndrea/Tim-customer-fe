import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take, throttleTime } from 'rxjs/operators';
import { fromEvent, Observable } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-support-by-product-tim',
    templateUrl: './support-by-product-tim.component.html',
    styleUrls: ['./support-by-product-tim.component.scss'],
    standalone: false
})
export class SupportByProductTimComponent implements OnInit, AfterViewInit, OnDestroy {

  support: any;
  activeFragment: any;
  fragments: string[];
  prodId: string;


  @Input() data;

  @ViewChild('faq', { read: ElementRef, static: true }) faq: ElementRef;
  @ViewChild('extraInfo', { read: ElementRef, static: true }) extraInfo: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit() {
    this.prodId = this.route.snapshot.paramMap.get('id');
    this.loadContent();
  }

  private loadContent() {
    this.kenticoTranslateService.getItem<any>('support').pipe(take(1)).subscribe(item => {
      const product = item.product_list.value.find(p => this.transformKenticoId(p.name.value) === this.prodId);
      if (item && product) {
        this.support = this.createContentFromKentico(item, product);
        this.fragments = Object.assign({}, this.support.sidebar.menu_items.map(i => i.link));
        this.activeFragment = this.fragments[0];
      } else {
        this.router.navigate(['/assistenza']);
      }
    })
  }


  private createContentFromKentico(item, product) {
    const support = {
      header: {
        title: product.name.value,
        subtitle: product.description.value
      },
      content: {
        faq: {
          title: product.faq.value[0].title.value[0].text.value,
          id: this.transformKenticoId(product.faq.value[0].title.value[0].text.value),
          questions: product.faq.value[0].questions.value.map(i => {
            return {
              question: i.question.value,
              answer: i.answer.value
            };
          })
        },
        extra_info: {
          title: product.extra_info.value[0].title.value,
          id: this.transformKenticoId(product.extra_info.value[0].title.value),
          body: product.extra_info.value[0].description.value
        }
      },
      sidebar: {
        title: item.detail_title.value,
        menu_items: [
          {
            name: product.extra_info.value[0].title.value,
            link: this.transformKenticoId(product.extra_info.value[0].title.value)
          }, {
            name: product.faq.value[0].title.value[0].text.value,
            link: this.transformKenticoId(product.faq.value[0].title.value[0].text.value)
          }
        ]
      }
    };
    return support;
  }


  ngAfterViewInit(): void {
    const faqYPosition = this.faq.nativeElement.children[0].offsetTop;
    this.route.fragment.subscribe(fragment => {
      this.activeFragment = fragment;
    });
    this.createScrollEventListener()
      .subscribe(scrollOffset => {
        if (scrollOffset >= faqYPosition) {
          this.activeFragment = this.fragments[1];
        } else {
          this.activeFragment = this.fragments[0];
        }
      });
  }

  private transformKenticoId(id: string) {
    return id.toLowerCase().replace(/\W/gm, '-').replace(/_/gm, '-');
  }

  createScrollEventListener(): Observable<number> {
    return fromEvent(window, 'scroll').pipe(untilDestroyed(this), throttleTime(10), map(() => window.pageYOffset));
  }

  ngOnDestroy() {
  }

}
