import { DataService } from './../../../../core/services/data.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-configuratore-layout',
  templateUrl: './configuratore-layout.component.html',
  styleUrls: ['./configuratore-layout.component.scss']
})
export class ConfiguratoreLayoutComponent {

  @Input() products: any;

  constructor(public dataService: DataService) { }

}
