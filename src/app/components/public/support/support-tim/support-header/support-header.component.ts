import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-header',
  templateUrl: './support-header.component.html',
  styleUrls: ['./support-header.component.scss']
})
export class SupportHeaderComponent implements OnInit {

  @Input() data;

  constructor(private router: Router) { }

  ngOnInit() {
    
  }

}
