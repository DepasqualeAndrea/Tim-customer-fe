import {Component, Input, OnInit} from '@angular/core';
import { DataService } from '@services';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-header-cb',
  templateUrl: './header-cb.component.html',
  styleUrls: ['./header-cb.component.scss']
})
export class HeaderCbComponent implements OnInit{

  @Input() headerContent;
  header_image: string;
  header_image_alt: string;

  constructor(
    public dataService: DataService,
    public kenticoTranslateService: KenticoTranslateService
  ) {}

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('products_page').pipe(take(1)).subscribe(item => {
      this.header_image = item.header_products.header_products_image.thumbnail.value[0].url;
      this.header_image_alt = item.header_products.header_products_image.thumbnail.value[0].description;
    });
    this.isPet();
  }

  isPet() {
    const storedPets = localStorage.getItem('pets');
    if (storedPets) {
      localStorage.removeItem('pets');
      window.dispatchEvent(new CustomEvent('storedPets'));
    }
}


}




