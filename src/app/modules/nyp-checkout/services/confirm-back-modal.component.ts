import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-confirm-back-modal",
  template: `
    <div class="card-shadow c-border-card bg-white p-40px slide-in-modal">
      <div class="close">
        <button
          type="button"
          class="close"
          aria-label="Close"
          (click)="closeModal()"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h3>
          {{ 'modale_broswer_back.back_to_preventivatore_title' | translate | async }}
        </h3>
        <p>
          {{ 'modale_broswer_back.back_to_preventivatore_message' | translate | async }}
        </p>
        <div class="modal-footer container">
          <button
            type="button"
            class="col-5 btn-back-outline"
            (click)="closeModal()"
          >
            {{ 'modale_broswer_back.back_to_preventivatore_cancel' | translate | async }}
          </button>
          <button
            type="button"
            class="btn btn-primary col-5"
            (click)="activeModal.close(true)"
          >
            {{ 'modale_broswer_back.back_to_preventivatore_confirm' | translate | async }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep.modal-content {
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: break-word;
        white-space: normal;
        padding: 0;
        position: relative;
        display: flex;
        flex-direction: column;
        pointer-events: auto;
        background-color: #fff;
        background-clip: padding-box;
        outline: 0;
        transform: translateY(0);
        transition: transform 0.2s ease-in-out;
      }

      ::ng-deep .modal-dialog {
        max-width: 700px !important;
        margin: 1.75rem auto !important;
      }

      ::ng-deep .modal.fade .modal-dialog {
        transition: transform 0.3s ease-out !important;
        transform: translateY(0) !important;
      }

      ::ng-deep .modal.fade.show .modal-dialog {
        transform: translateY(0) !important;
      }

      ::ng-deep .modal.fade:not(.show) .modal-dialog {
        transform: translateY(-100%) !important;
      }

      ::ng-deep .modal-dialog-centered {
        display: block;
      }

      .flow-modal {
        display: flex;
        justify-content: end;
        flex-direction: column;
        font-family: "Tim Sans";
      }

      .modal-header {
        align-items: center;
        padding: 16px;
        background: linear-gradient(#031743, #0a3393) !important;
        color: white;
        border-radius: 0px !important;
        h6 {
          margin-bottom: 0px;
          font-weight: 600;
        }
      }

      .modal-header .close {
        padding: 1rem 1rem;
        margin: -1rem -1rem -1rem auto;
        color: white;
      }

      .modal-body {
        height: auto;
        background-color: #ffffff;
        overflow: hidden;
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 0px;
        p {
          margin-top: 0;
          margin-bottom: 1rem;
          font-weight: 400;
          font-size: 16px;
        }
      }

      .modal-footer {
        border: none;
        border-radius: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }

      .close {
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
        color: #000;
        text-shadow: 0 1px 0 #fff;
        opacity: 1;
        text-align: end;
        padding: 0px;
        position: relative;
        top: -10px;
        right: -10px;
      }

      .btn {
        cursor: pointer;
        width: 230px;
        background-color: #003a79;
        color: azure;
        white-space: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
        min-height: fit-content;
        border-radius: 0;
        border: none;
        padding: 8px;
        width: 100%;
        font-size: 14px;
        line-height: 1.2;
      }

      .btn-back-outline {
        cursor: pointer;
        width: 230px;
        background-color: white;
        color: #003a79;
        text-transform: uppercase;
        white-space: normal;
        font-weight: 700;
        word-wrap: break-word;
        overflow-wrap: break-word;
        min-height: -moz-fit-content;
        min-height: fit-content;
        border-radius: 0;
        border: none;
        padding: 16px;
        font-size: 14px;
        border: 1px solid #003a79;
      }

      .slide-in-modal {
        animation: slideInFromTop 0.3s ease-out forwards;
      }

      @keyframes slideInFromTop {
        0% {
          transform: translateY(-50px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }

      ::ng-deep .slide-out {
        animation: slideOutToTop 0.3s ease-in forwards !important;
      }

      @keyframes slideOutToTop {
        0% {
          transform: translateY(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-50px);
          opacity: 0;
        }
      }

      ::ng-deep .modal {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1050;
        display: none;
        width: 100%;
        height: 100%;
        overflow: hidden;
        outline: 0;
      }
    `,
  ],
})
export class ConfirmBackModalComponent {

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  closeModal(): void {
    // Aggiungiamo una classe per l'animazione di uscita
    const modalElement = document.querySelector(".modal-dialog");
    if (modalElement) {
      modalElement.classList.add("slide-out");

      // Ritardiamo la chiusura effettiva per permettere l'animazione
      setTimeout(() => {
        this.activeModal.dismiss(false);
      }, 300);
    } else {
      this.activeModal.dismiss(false);
    }
  }
}

