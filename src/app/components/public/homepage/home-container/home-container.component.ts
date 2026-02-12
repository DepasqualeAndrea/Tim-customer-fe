import {Component, OnInit} from '@angular/core';
import {DataService} from '@services';

@Component({
  templateUrl: './home-container.component.html',
  selector: 'app-home-container'
})
export class HomeContainerComponent implements OnInit {

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    // monkey patch to force view home
    if ((this.dataService.tenantInfo.tenant || '').startsWith('yolo')) {
      history.pushState(history.state, '', '/');
    }
  }

}
