import { AfterViewInit, Component, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-additional-guarantees-slider',
  templateUrl: './additional-guarantees-slider.component.html',
  styleUrls: ['./additional-guarantees-slider.component.scss']
})
export class AdditionalGuaranteesSliderComponent extends PreventivatoreAbstractComponent implements OnChanges, AfterViewInit {

  
  @ViewChild('slider') slider: ElementRef;
  @ViewChild('sliderCard') sliderCard: ElementRef;
  @ViewChild('mobileSlider') mobileSlider: ElementRef;
  @ViewChild('mobileSliderCard') mobileSliderCard: ElementRef;

  numberOfSliders = 0;
  activeSlider = 1;
  sliderCardWidth = 0;
  mobileSelectSlider = 0;

  ngOnChanges() {
    if (this.data && this.isDataNotEmpty()) {
      this.numberOfSliders = this.data.list.length;
    }
  }
  
  ngAfterViewInit() {
    if (this.data && this.isDataNotEmpty()) {
      this.sliderCardWidth = (this.sliderCard.nativeElement.offsetWidth || this.mobileSliderCard.nativeElement.offsetWidth) + 15;
    }
  }

  onNextClick(){
    if (this.activeSlider < this.numberOfSliders) {
      const newPosition = this.activeSlider * this.sliderCardWidth;
      this.slider.nativeElement.setAttribute('style', `left: -${newPosition}px`);
      this.activeSlider++;
    }
  }

  onPreviousClick(){
    if (this.activeSlider > 1 ) {
      this.activeSlider--;
      const newPosition = (this.activeSlider - 1) * this.sliderCardWidth;
      this.slider.nativeElement.setAttribute('style', `left: -${newPosition}px`);
    }
  }

  selectSlider(selectedSliderNumber) {
    this.mobileSelectSlider = selectedSliderNumber;
    const newPosition = selectedSliderNumber * this.sliderCardWidth;
    this.mobileSlider.nativeElement.setAttribute('style', `left: -${newPosition}px`);
  }

  public isDataNotEmpty(): boolean {
    return JSON.stringify(this.data) != '{}'
  }
}
