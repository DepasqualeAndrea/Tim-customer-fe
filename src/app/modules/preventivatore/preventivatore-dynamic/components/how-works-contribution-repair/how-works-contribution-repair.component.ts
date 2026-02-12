import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-how-works-contribution-repair',
  templateUrl: './how-works-contribution-repair.component.html',
  styleUrls: ['./how-works-contribution-repair.component.scss']
})
export class HowWorksContributionRepairComponent extends PreventivatoreAbstractComponent implements OnInit {

  constructor(ref: ChangeDetectorRef, private dataService: DataService) {

    super(ref);

   }

  ngOnInit() {
  }

}
