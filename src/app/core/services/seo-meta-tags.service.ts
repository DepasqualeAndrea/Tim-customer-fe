import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { KenticoTranslateService } from '../../modules/kentico/data-layer/kentico-translate.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Metatag } from '../models/seo/metatag';
import { NypSeoMetaTagsService } from '@NYP/ngx-multitenant-core';

@Injectable({
  providedIn: 'root'
})

export class SeoMetaTagsService {

  private kenticoMap: Map<string, string> = new Map<string, string>();
  private loaded = false;

  constructor(
    private router: Router,
    private kenticoTranslateService: KenticoTranslateService,
    private meta: Meta,
    private title: Title,
    protected nypSeoMetaTagService: NypSeoMetaTagsService,
    private http: HttpClient
  ) {
  }


  initSeoTags() {
    if (!this.loaded) {
      this.nypSeoMetaTagService.getListFromDb((tag: string) => this.kenticoTranslateService.getItem(tag));
    } else {
      this.resolveCurrentUrl();
      this.loadRouterEvent();
    }

  }


  private resolveCurrentUrl() {
    const url = this.router.url;
    this.setSeoForUrl(url);

  }
  private loadRouterEvent(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setSeoForUrl(event.url);
      }
    });
  }

  private setSeoForUrl(url: string): void {
    const kenticoCode = this.kenticoMap.has(url) ? this.kenticoMap.get(url) : 'default';
    this.setSeoTags(kenticoCode);
  }

  private setSeoTags(kenticoCode) {
    this.kenticoTranslateService.getItem<any>(`seo.meta_title_${kenticoCode}`).pipe(take(1)).subscribe(item => {
      if (item.value && item.value !== `seo.meta_title_${kenticoCode}`) {
        this.title.setTitle(item.value);
      }
    });
    this.meta.removeTag('name="description"');
    this.kenticoTranslateService.getItem<any>(`seo.meta_description_${kenticoCode}`).pipe(take(1)).subscribe(item => {
      if (item.value && item.value !== `seo.meta_description_${kenticoCode}`) {
        this.meta.addTag({ name: 'description', content: item.value });
      }
    });
  }

}


