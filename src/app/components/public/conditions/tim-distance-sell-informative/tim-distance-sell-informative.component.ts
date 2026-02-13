import { Component, OnDestroy, OnInit } from '@angular/core'
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service'
import { untilDestroyed } from 'ngx-take-until-destroy'

@Component({
    selector: 'app-tim-distance-sell-informative',
    templateUrl: './tim-distance-sell-informative.component.html',
    styleUrls: ['./tim-distance-sell-informative.component.scss'],
    standalone: false
})
export class TimDistanceSellInformativeComponent implements OnInit, OnDestroy {

  content: any

  constructor(private kenticoTranslateService: KenticoTranslateService) { }

  ngOnInit() {
    this.initializeKenticoContent()
  }

  initializeKenticoContent() {
    this.kenticoTranslateService.getItem<any>('distance_sell_informative').pipe(untilDestroyed(this)).subscribe(item => {
      this.content = {
        title: item.title.value,
        body: item.description.value
      }
    })
  }

  ngOnDestroy() {

  }

}
