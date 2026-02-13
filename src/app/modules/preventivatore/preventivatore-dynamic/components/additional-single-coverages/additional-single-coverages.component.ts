import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-additional-single-coverages',
    templateUrl: './additional-single-coverages.component.html',
    styleUrls: ['./additional-single-coverages.component.scss'],
    standalone: false
})
export class AdditionalSingleCoveragesComponent extends PreventivatoreAbstractComponent implements OnInit {


  ngOnInit() {
  }

}
