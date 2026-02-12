import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@services';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import {KenticoTranslateService} from '../../../kentico/data-layer/kentico-translate.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy{
  @ViewChild('checkoutLoginRegisterForm', { static: true }) loginRegisterFormComponent: ContainerComponent;
  registerLogo: any;
  appContainerData: {[key: string]: any} = {};

  logoImage: string;

  constructor(
    private router: Router,
    public  dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService
  ) {}

  ngOnInit() {
    this.appContainerData['isFacebookDisabled'] = this.dataService.getIsFacebookDisabled();

    this.redirectForDisabledTenants();
    this.attachEventAndPropertiesToRegisterFormComponent();
    this.kenticoTranslateService.getItem<any>('navbar.logo').pipe(take(1)).subscribe(item => {
      this.logoImage = item.images[0].url;
    });
  }

  attachEventAndPropertiesToRegisterFormComponent(){
    this.loginRegisterFormComponent
        .getReference().pipe(take(1)).subscribe((componentRef) => {
          componentRef.instance.registerSuccess.pipe(take(1)).subscribe(() => this.goToLogin());
          }
        );
  }
  redirectForDisabledTenants() {

    this.componentFeaturesService.useComponent('login');
    this.componentFeaturesService.useRule('registration');
    if(!this.componentFeaturesService.isRuleEnabled()) {
      this.goToLogin();
    }
  }
  goToLogin() {
    this.router.navigateByUrl('/login');
  }
  ngOnDestroy() {}
}

