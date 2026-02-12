import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { DataService } from '@services';
import {LocaleService} from '../../../core/services/locale.service';

@Component({
  selector: 'app-mobile-download',
  templateUrl: './mobile-download.component.html',
  styleUrls: ['./mobile-download.component.scss']
})
export class MobileDownloadComponent implements OnInit {

  constructor(
    public dataService: DataService,
    public locale: LocaleService) { }

  ngOnInit() {
  }

}
