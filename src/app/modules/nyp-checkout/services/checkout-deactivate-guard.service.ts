import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmBackModalComponent } from "./confirm-back-modal.component";
import {  Observable, Subject } from "rxjs";
import { NypDataService } from "./nyp-data.service";

@Injectable({
  providedIn: "root",
})
export class CheckoutDeactivateGuard  implements OnDestroy {
  private destroy$ = new Subject<void>();

  private readonly PROTECTED_PATHS = [
    "/login-register",
    "/address",
    "/survey",
    "/payment",
    "/insurance-info",
    "/consensuses",
  ];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private nypDataService: NypDataService,
  ) {}

  canDeactivate(
    component: any,
    currentRoute: any,
    currentState: any,
    nextState?: any
  ): Observable<boolean> | Promise<boolean> | boolean {

    const currentUrl = this.router.url;
    const isInProtectedPath = this.PROTECTED_PATHS.some(path => currentUrl.includes(path));

    if (!isInProtectedPath) {
      return true;
    }

    if (this.router.getCurrentNavigation()?.trigger === 'popstate') {
      if (this.modalService.hasOpenModals()) {
        return;
      }

      return new Observable<boolean>(observer => {
        const modalRef = this.modalService.open(ConfirmBackModalComponent, {
          centered: true,
          backdrop: "static",
          keyboard: false,
          windowClass: "confirm-back-modal",
        });

        modalRef.result.then(
          (result) => {
            if (result) {
              observer.next(true);
             window.location.reload()
            } else {
              observer.next(false);
            }
            observer.complete();
          },
          () => {
            observer.next(false);
            observer.complete();
          }
        );
      });
    }

    this.modalService.dismissAll();
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
