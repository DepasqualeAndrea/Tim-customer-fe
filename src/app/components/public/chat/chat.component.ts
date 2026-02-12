import {Component, OnInit, Input} from '@angular/core';
import { request } from 'http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() chatUrl;

  constructor() {
  }

  chatOpened = false;

  ngOnInit() {
  }

  chatOpen() {
    this.chatOpened = !this.chatOpened;
  }

}
