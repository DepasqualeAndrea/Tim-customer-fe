import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
    selector: 'app-tmp-comp',
    template: '<div #template></div>',
    outputs: ['tmpInnerEvent'],
    standalone: false
})
export class TmpComponent implements AfterViewInit {

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  @Input() template: string;
  tmpInnerEvent = new EventEmitter<any>();

  innerEvent(eventData: any) {
    this.tmpInnerEvent.emit(eventData);
  }

  @ViewChild('template') htmlTemplate: ElementRef;

  ngAfterViewInit(){
    this.htmlTemplate.nativeElement.outerHTML = this.template;
    const buttons = document.getElementsByTagName('button');
    const anchors = document.getElementsByTagName('a');
    const links = (Array.from(buttons) as HTMLElement[] ).concat(Array.from(anchors));
    const linkElements = links.filter(button => {
      const attributes = Array.from(button.attributes)
      return attributes.some(attribute => {
        return attribute.name === 'routerlink'
      })
    });
    linkElements.forEach(button => {
      button.addEventListener('click', () => {
        this.router.navigate([button.attributes['routerlink'].value])
      })
    });
  }
}