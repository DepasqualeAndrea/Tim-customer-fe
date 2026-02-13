import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-support-sidebar',
    templateUrl: './support-sidebar.component.html',
    styleUrls: ['./support-sidebar.component.scss'],
    standalone: false
})
export class SupportSidebarComponent implements OnInit {

  @Input() data;
  @Input() activeFragment;

 

  constructor() { }

  ngOnInit() {
    
  }


  getActiveItemName() {
    if (this.data && this.activeFragment) {
      return this.data.menu_items.find(item => item.link === this.activeFragment).name
    } else if (this.data && !this.activeFragment) {
      return this.data.menu_items[0].name
    }
  }

}
