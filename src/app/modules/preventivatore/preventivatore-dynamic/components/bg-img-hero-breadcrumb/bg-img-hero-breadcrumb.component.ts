import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-bg-img-hero-breadcrumb',
  templateUrl: './bg-img-hero-breadcrumb.component.html',
  styleUrls: ['./bg-img-hero-breadcrumb.component.scss']
})
export class BgImgHeroBreadcrumbComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(ref: ChangeDetectorRef, public dataService: DataService){
    super(ref)
  }

  ngOnInit() {
  }

}
