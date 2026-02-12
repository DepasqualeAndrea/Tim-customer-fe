import { KenticoNetInsuranceService } from 'app/core/services/kentico/kentico-net-insurance.service';
import { Component } from "@angular/core";
import { PageSection } from 'app/modules/kentico/models/architecture.model';
import {KenticoTranslateService} from '../../../../modules/kentico/data-layer/kentico-translate.service';

class Header {
    title: string;
    body: string;
    imageUrl: string;
  }

@Component({
    selector: 'app-contatti-net',
    templateUrl: './contatti-net.component.html',
    styleUrls: ['./contatti-net.component.scss']
})
export class ContattiNetComponent {
    header: Header = new Header();

    constructor(
      public  kenticoService: KenticoNetInsuranceService,
      private kenticoTranslateService: KenticoTranslateService
      ) { }

      private initHeader() : void {
        this.kenticoTranslateService.getItem<PageSection>('contatti_header')
        .map<PageSection, Header>(value => {
          const header: Header = new Header();
          header.title = value.title.value;
          header.body = value.body.value;
          header.imageUrl = value.images.value[0].url;
          return header;
        })
        .subscribe(h => this.header = h);
      }

      ngOnInit() {
        this.initHeader();
        this.kenticoService.setContentsOf('contact_form');
      }
}
