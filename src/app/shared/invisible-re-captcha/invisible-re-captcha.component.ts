// import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

// @Component({
//   selector: 'app-invisible-re-captcha',
//   template: `
//     <re-captcha
//       #captchaRef="reCaptcha"
//       siteKey="6LcQo78qAAAAANtZagPkmFTa_MhIEe3rQ0vZPzd7"
//       size="invisible"
//       (resolved)="$event && resolved($event)"
//     ></re-captcha>`,
// })
// export class InvisibleReCaptchaComponent implements AfterViewInit {
//   @Output('resolved') resolve: EventEmitter<string> = new EventEmitter();
//   @ViewChild('captchaRef') recaptcha;

//   ngAfterViewInit(): void {
//     this.recaptcha.execute();
//   }

//   public resolved(captchaResponse: string): void {
//     this.resolve.emit(captchaResponse);
//   }
// }
