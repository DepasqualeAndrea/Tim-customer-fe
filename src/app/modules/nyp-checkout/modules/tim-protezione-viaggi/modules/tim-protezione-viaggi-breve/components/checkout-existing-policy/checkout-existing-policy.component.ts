import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-checkout-existing-policy',
    templateUrl: './checkout-existing-policy.component.html',
    styleUrls: ['./checkout-existing-policy.component.scss'],
    standalone: false
})
export class CheckoutExistingPolicyComponent implements OnInit {
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    protected authService: AuthService,
  ) { }

  content: any;

  ngOnInit() {
    this.getKenticoContent();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>("existing_policy_result").pipe(take(1)).subscribe(item => {
      this.createContentItem(item);
    });
  }

  createContentItem(kenticoItem) {
    this.content = {
      title: kenticoItem.existing_policy_title.value,
      description: kenticoItem.existing_policy_description.value,
      button: kenticoItem.existing_policy_button.value
    };
  }

}
