import { Component, OnInit } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-bg-img',
    templateUrl: './bg-img.component.html',
    styleUrls: ['./bg-img.component.scss'],
    standalone: false
})
export class BgImgComponent extends PreventivatoreAbstractComponent implements OnInit {

  ngOnInit() {
  }

}
