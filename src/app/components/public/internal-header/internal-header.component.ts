import { KenticoMediaworld } from 'app/core/services/kentico/kentico-mediaworld.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-internal-header',
  templateUrl: './internal-header.component.html',
  styleUrls: ['./internal-header.component.scss']
})
export class InternalHeaderComponent implements OnInit {

  constructor(public k: KenticoMediaworld) {}
  ngOnInit() {
    this.k.setContentsOf('header');
  }
}
