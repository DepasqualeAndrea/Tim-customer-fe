import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { IBreadCrumb } from './support-breadcrumb.interface';

@Component({
    selector: 'app-support-breadcrum',
    templateUrl: './support-breadcrum.component.html',
    styleUrls: ['./support-breadcrum.component.scss'],
    standalone: false
})

export class SupportBreadcrumComponent implements OnInit {

  public breadcrumbs: IBreadCrumb[] = [ 
    {
      label: 'Home',
      url: '/products'
    },
    {
      label: 'Assistenza',
      url: '/assistenza'
    },
  ]
  breadcrumbProductMap: any[] = []

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loadContent()
  }

  getBreadcrumbMapfromRoute() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      const prodId = this.activatedRoute.snapshot.paramMap.get('id');
      const label = this.breadcrumbProductMap.find(bProd =>
        bProd.id === prodId
      ).value
      this.breadcrumbs.push({
        label: `${label}`,
        url: `/assistenza/${prodId}`
      })
    }
  }

  loadContent() {
    this.kenticoTranslateService.getItem<any>('support').pipe(take(1)).subscribe(item => {
      item.product_list.value.forEach(product => {
        this.breadcrumbProductMap.push({
          id: product.name.value.toLowerCase().replace(/\W/gm, '-'),
          value: product.name.value
        })
      })
      this.getBreadcrumbMapfromRoute()
    })
  }
  

}
