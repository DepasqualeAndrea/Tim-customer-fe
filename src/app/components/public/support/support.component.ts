import {Component, OnInit} from '@angular/core';
import {DataService} from '@services';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  tenant: string;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.tenant = this.dataService.tenantInfo.footer.layout;
  }

}
