import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-how-works-table-tabs',
  templateUrl: './how-works-table-tabs.component.html',
  styleUrls: ['./how-works-table-tabs.component.scss'],
})
export class HowWorksTableTabsComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(ref: ChangeDetectorRef) {
    super(ref);
  }

  ngOnInit(): void {
    this.selectedTab('erv-mountain-gold');
  }

  selectedTab(productCode) {
    this.data.selected_tab = productCode;
  }

}
