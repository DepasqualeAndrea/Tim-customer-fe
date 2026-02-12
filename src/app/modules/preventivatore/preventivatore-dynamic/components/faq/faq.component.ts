import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from 'app/core/services/data.service';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent extends PreventivatoreAbstractComponent implements OnInit {

  faqsMobile : [];

  constructor(ref: ChangeDetectorRef, private dataService: DataService) {
    super(ref);
  }
  ngOnInit() {
    this.setTargetBlank()
  }

  setTargetBlank() {
    if (this.dataService.tenantInfo.tenant === 'banca-sella_db') {
      let links = document.querySelectorAll(".answer-text-link p a")
      links.forEach((a) => {
        a.setAttribute('target', '_blank');
      })
    }
  }

}
