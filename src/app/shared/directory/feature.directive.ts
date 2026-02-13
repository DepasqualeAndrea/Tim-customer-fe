import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { DataService } from '@services';

@Directive({
    selector: '[featureToggle]',
    standalone: false
})
export class FeatureToggleDirective implements OnInit {
  @Input() featureToggle: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (this.isEnabled()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  isEnabled() {

    const features = this.dataService.featureToggle;

    return features[this.featureToggle];
  }
}
