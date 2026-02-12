import { Image } from 'app/modules/kentico/models/architecture.model';
import { KenticoNetInsuranceService } from 'app/core/services/kentico/kentico-net-insurance.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-chi-siamo-net',
  templateUrl: './chi-siamo-net.component.html',
  styleUrls: ['./chi-siamo-net.component.scss']
})
export class ChiSiamoNetComponent implements OnInit, OnDestroy {

  background_image;

  constructor(
    public kenticoService: KenticoNetInsuranceService
  ) { }

  ngOnInit() {
    this.initializeKenticoContents();
  }

  initializeKenticoContents() {
    this.kenticoService.setContentsOf('chi_siamo');
    this.setBackgroundImg();
  }

  setBackgroundImg() {
    this.kenticoService.getItem<Image>('chi_siamo_background_image').pipe(untilDestroyed(this)).subscribe(item => {
      const url = item.image.value[0].url;
      this.background_image = { 'background-image': 'url(' + url + ')' };
    });
  }

  ngOnDestroy() {
  }
}
