import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataService} from '@services';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-faq-preventivatore-new',
    templateUrl: './faq-preventivatore-new.component.html',
    styleUrls: ['./faq-preventivatore-new.component.scss'],
    standalone: false
})
export class FaqPreventivatoreNewComponent extends PreventivatoreAbstractComponent implements OnInit {

  ariaExpanded = true;

  constructor(
    ref: ChangeDetectorRef,
    private dataService: DataService
  ) {
    super(ref);
  }

  ngOnInit() {
  }

  showImg() {
    const imgClosed = document.getElementById('closed');
    const imgOpened = document.getElementById('opened');
    if (this.ariaExpanded) {
      imgClosed.style.display = 'none';
      imgOpened.style.display = 'block';
    } else {
      imgClosed.style.display = 'block';
      imgOpened.style.display = 'none';
    }
  }

}
