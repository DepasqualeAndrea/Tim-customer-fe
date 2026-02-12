import { Component, OnInit, OnDestroy } from '@angular/core';
import { KenticoYoloService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ContentItem, ContentItemIndexer } from 'kentico-cloud-delivery';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';

type Tabs = Array<{
  title: string;
  description: string;
}>

type AdministrationContent = {
  image: string;
  tabs: Tabs;
}

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit, OnDestroy {

  model: AdministrationContent;

  constructor(private kenticoYoloService: KenticoYoloService) { }

  ngOnInit() {
    this.kenticoYoloService.getItem<ContentItem>('board_of_directors_yolo').pipe(untilDestroyed(this)).subscribe(item => {
      this.model = this.transformKenticoModel(item);
    });
  }

  transformKenticoModel(item: ContentItem): AdministrationContent {
    console.log(item)
    return {
      image: item.header_image.value[0].url,
      tabs: this.getTabs(item.tabs.value)
    }
  }

  getTabs(tabs: ContentItemIndexer): Tabs {
    return tabs.map(tab => ({
      title: tab.title.value,
      description: RichTextHtmlHelper.computeHtml(tab.description)
    }))
  }

  ngOnDestroy() {

  }

}
