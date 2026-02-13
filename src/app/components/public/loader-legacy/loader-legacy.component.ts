import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../../../core/services/loader.service';

@Component({
    selector: 'app-loader-legacy',
    styles: [`
    @media only screen and (min-width: 320px) {
      #loaderModal {
        z-index: 99999;
        touch-action: none;
      }

      .loaderModalNoMargin {
        margin: 0 !important;
      }

      .modalContentLoginLoader {
        background-color: transparent !important;
      }

      .wrapperLoader {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
      }

      .contLoader {
        position: relative;
        width: 5rem;
        height: 5rem;
      }

      .cLoader {
        height: 2rem;
        width: 2rem;
        position: absolute;
        border-radius: 50%;
      }

      .c__1 {
        background-color: #ffffff;
        animation: linear-1Loader 2s infinite;
      }

      .c__2 {
        background-color: var(--primary-y);
        right: 0;
        top: 0;
        animation: linear-2Loader 2s infinite;
      }

      .c__3 {
        background-color: var(--primary-y);
        left: 0;
        bottom: 0;
        animation: linear-3Loader 2s infinite;
      }

      .c__4 {
        background-color: #ffffff;
        right: 0;
        bottom: 0;
        animation: linear-4Loader 2s infinite;
      }

      @keyframes linear-1Loader {
        0% {
          transform: rotate(-45deg) translateY(0);
        }
        50% {
          transform: rotate(-45deg) translateY(4.5rem);
        }
        100% {
          transform: rotate(-45deg) translateY(0);
        }
      }
      @keyframes linear-2Loader {
        0% {
          transform: rotate(45deg) translateY(0);
        }
        50% {
          transform: rotate(45deg) translateY(4.5rem);
        }
        100% {
          transform: rotate(45deg) translateY(0);
        }
      }
      @keyframes linear-3Loader {
        0% {
          transform: rotate(45deg) translateY(0);
        }
        50% {
          transform: rotate(45deg) translateY(-4.5rem);
        }
        100% {
          transform: rotate(45deg) translateY(0);
        }
      }
      @keyframes linear-4Loader {
        0% {
          transform: rotate(-45deg) translateY(0);
        }
        50% {
          transform: rotate(-45deg) translateY(-4.5rem);
        }
        100% {
          transform: rotate(-45deg) translateY(0);
        }
      }
    }
  `],
    template: `
    <div *ngIf="loader && loader.legacy" class="wrapperLoader">
      <div class="contLoader">
        <div class="cLoader c__1"></div>
        <div class="cLoader c__2"></div>
        <div class="cLoader c__3"></div>
        <div class="cLoader c__4"></div>
      </div>
    </div>
    <div *ngIf="(loader && !loader.legacy) || !loader" class="block-ui-spinner">
      <div class="loader"></div>
      <div class="message">Loading...</div>
    </div>
  `,
    standalone: false
})
export class LoaderLegacyComponent implements OnInit {

  loader: any;

  constructor(
    private loaderService: LoaderService
  ) {
    this.loader = this.loaderService.getTypeLoader();
  }

  ngOnInit() {
  }

}
