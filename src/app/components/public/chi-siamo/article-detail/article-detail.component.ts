import { NypUtilsService } from '@NYP/ngx-multitenant-core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { map, take, tap } from 'rxjs/operators';

@Component({
    selector: 'app-article-detail',
    templateUrl: './article-detail.component.html',
    styleUrls: ['./article-detail.component.scss'],
    standalone: false
})
export class ArticleDetailComponent implements OnInit {

  articleId: string;

  content: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kenticoTranslateService: KenticoTranslateService,
    private utilsService: UtilsService,
    protected nypUtilsService: NypUtilsService,
  ) { }

  ngOnInit() {
    this.articleId = this.route.snapshot.paramMap.get('article');
    this.loadContent();
  }

  private loadContent(): void {
    this.kenticoTranslateService.getItem<any>('chi_siamo_employee').pipe(take(1)).subscribe(
      item => {
        const articleDetails = item.news_articles.value.find(article =>
          this.articleId === article.title.value.toLowerCase().replace(/ /g, '-')
        )
        this.setArticleContent(item, articleDetails.article_detail.value[0])
      })
  }

  private setArticleContent(kenticoItem, articleDetailsContent): void {
    this.content = {
      breadcrumb: {
        home: kenticoItem.breadcrumb_home.value,
        who_we_are: kenticoItem.breadcrumb_who_we_are.value,
      },
      title: kenticoItem.news_title.value,
      logoIcon: kenticoItem.logo_icon.value[1].url,
      articleTitle: articleDetailsContent.title.value,
      articleDate: articleDetailsContent.date.value,
      articleDescription: articleDetailsContent.description.value,
      downloadIcon: articleDetailsContent.download_icon.value[0].url,
      downloadLink: articleDetailsContent.download_link.value,
      labelLink: articleDetailsContent.download_link_label.value,
      buttonLabel: articleDetailsContent.back_button.value,
    }
  }

  public goHome(): void {
    this.router.navigate(['/products'])
  }

  public goBack(): void {
    this.router.navigate(['/chi-siamo'])
  }

  public download(link: string, articleId: string, event): void {
    if (!this.utilsService.userAgentTest()) {
      event.preventDefault();
      this.nypUtilsService.downloadFromLink(link, articleId + '.pdf').pipe(
        map(response => this.utilsService.parseDocumentResponse(response)),
        tap(file => this.utilsService.saveFile(file))
      ).subscribe()
    }
  }
}
