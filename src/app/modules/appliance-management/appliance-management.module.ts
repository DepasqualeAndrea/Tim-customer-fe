import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApplianceManagementFormComponent} from './appliance-management-form/appliance-management-form.component';
import {ApplianceManagementListComponent} from './appliance-management-list/appliance-management-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ApplianceManagementFormComponent, ApplianceManagementListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule.forRoot(),
  ],
  exports: [
    ApplianceManagementFormComponent, ApplianceManagementListComponent
  ]
})
export class ApplianceManagementModule { }
