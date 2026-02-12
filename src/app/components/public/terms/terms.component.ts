import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(public dataService:DataService) { }

 

  ngOnInit() {
  }

}
