import {Component, OnInit} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-what-to-know-more-information',
    templateUrl: './what-to-know-more-information.component.html',
    styleUrls: ['./what-to-know-more-information.component.scss'],
    standalone: false
})
export class WhatToKnowMoreInformationComponent extends  PreventivatoreAbstractComponent implements OnInit {
  selectedLink: string;



  ngOnInit() {
    this.selectedLink = this.data.links[0].text;
  }

  toggleCollapse(accordion) {
    accordion.collapsed = !accordion.collapsed;

  }
  selectLink(link) {
   this.selectedLink = link.text;
  }







}
