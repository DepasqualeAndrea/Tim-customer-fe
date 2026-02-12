import { Component, OnDestroy, OnInit } from '@angular/core';
import { PreventivatoreProviderService } from './services/preventivatore-provider.service';
import { Router } from '@angular/router';
import { CheckoutService, DataService } from '@services';
import { PreventivatorePage } from '../services/preventivatore-page.interface';
import 'hammerjs';
import { PreventivatoreReducerProvider } from './state/preventivatore-reducer-provider';
import { PreventivatoreAbstractDynamicComponent } from './preventivatore-dynamic-abstract';

@Component({
  selector: 'app-preventivatore-dynamic',
  templateUrl: './preventivatore-dynamic.component.html',
  styleUrls: ['./preventivatore-dynamic.component.scss']
})
export class PreventivatoreDynamicComponent extends PreventivatoreAbstractDynamicComponent implements OnInit, OnDestroy, PreventivatorePage {
  constructor(
    service: PreventivatoreProviderService,
    router: Router,
    dataService: DataService,
    checkoutService: CheckoutService,
    preventivatoreReducerProvider: PreventivatoreReducerProvider,
  ) {
    super(service, router, dataService, checkoutService, preventivatoreReducerProvider)
  }
}
