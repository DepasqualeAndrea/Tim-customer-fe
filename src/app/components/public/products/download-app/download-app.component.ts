import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-download-app',
    templateUrl: './download-app.component.html',
    styleUrls: ['./download-app.component.scss'],
    standalone: false
})
export class DownloadAppComponent implements OnInit {

  @Input() downloadApp;

  constructor() {}

  ngOnInit() {}


}
