import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CbProductsComponent } from './cb-products/cb-products.component';
import { RouterModule, Routes } from '@angular/router';
import { CbModule } from './cb.module';

const routes: Routes = [
  { path: 'prodotti', component: CbProductsComponent },
];

@NgModule({
    declarations: [
        CbProductsComponent,
    ],
    imports: [
        CommonModule,
        CbModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
        CbProductsComponent,
    ]
})
export class CbRoutingModule {}
