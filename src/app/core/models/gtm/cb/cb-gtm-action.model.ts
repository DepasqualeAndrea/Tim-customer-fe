export class CbGtmAction {
  event: string;
  action: string;
  choice: string;

  constructor(event: string, action: string, choice: string) {
    this.event = event;
    this.action = action;
    this.choice = choice;
  }
}
