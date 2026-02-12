import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-dynamic/components/preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-what-is-for-yolo-multirischi',
  templateUrl: './what-is-for-yolo-multirischi.component.html',
  styleUrls: ['./what-is-for-yolo-multirischi.component.scss']
})
export class WhatIsForYoloMultirischiComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(ref: ChangeDetectorRef) {
    super(ref);
  }

  ngOnInit() {
  }

}
