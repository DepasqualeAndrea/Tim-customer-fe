import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {KenticoTranslateService} from '../../../modules/kentico/data-layer/kentico-translate.service';
import {take} from 'rxjs/operators';
import {LocaleService} from '../../../core/services/locale.service';

@Component({
    selector: 'app-change-country',
    templateUrl: './change-country.component.html',
    styleUrls: ['./change-country.component.scss'],
    standalone: false
})
export class ChangeCountryComponent implements OnInit {

  countryToChoice: any;
  imgFlagCountryNavbar: any;
  isClickedChoiceCountry = false;

  constructor(private activatedRoute: ActivatedRoute,
              private localeService: LocaleService,
              private kenticoTranslateService: KenticoTranslateService) {
  }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('navbar').pipe(take(1)).subscribe(resp => {
      this.imgFlagCountryNavbar = resp.navbar_flag_country.value[0].url;
      this.countryToChoice = resp.choose_the_country.value;
    });
  }

}
