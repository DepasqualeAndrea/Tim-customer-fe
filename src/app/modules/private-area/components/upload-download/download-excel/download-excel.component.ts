import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-download-excel',
  templateUrl: './download-excel.component.html',
  styleUrls: ['./download-excel.component.scss']
})
export class DownloadExcelComponent implements OnInit {
  @Input() state: {
    linkFile: string
  };
  @Input() captionText: {
    private_area_download_file: string
  };
  constructor() { }

  ngOnInit() {
  }

}
