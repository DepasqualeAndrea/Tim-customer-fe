import { ChangeDetectorRef, Directive, EventEmitter, Output } from "@angular/core";

@Directive()
export abstract class CompletedStepEdit {
  @Output() handleStepChanged: EventEmitter<boolean> = new EventEmitter();

  public emitHandleStepChanged(): void {
    this.handleStepChanged.emit(true);
  }
  constructor(private ref: ChangeDetectorRef){
  }
}
