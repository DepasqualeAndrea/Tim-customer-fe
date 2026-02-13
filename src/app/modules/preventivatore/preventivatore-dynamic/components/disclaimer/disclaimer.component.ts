import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-disclaimer',
    templateUrl: './disclaimer.component.html',
    styleUrls: ['./disclaimer.component.scss'],
    standalone: false
})
export class DisclaimerComponent extends PreventivatoreAbstractComponent implements OnInit {

  kenticoContent: any;

  constructor(
    ref: ChangeDetectorRef, 
    private kenticoTranslateService: KenticoTranslateService,) {
    super(ref);
   }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('disclaimer_yolo_erv_sci').pipe().subscribe(item => {
      this.kenticoContent = item;
    });
  }

}

