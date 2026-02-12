import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './containers/container.component';
import { ViewLoaderDirective } from './containers/view-loader.directive';
import { EmptyComponent } from './empty/empty.component';

@NgModule({
  declarations: [
    ViewLoaderDirective,
    ContainerComponent,
    EmptyComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ContainerComponent
  ]
})
export class ComponentLoaderModule { }
