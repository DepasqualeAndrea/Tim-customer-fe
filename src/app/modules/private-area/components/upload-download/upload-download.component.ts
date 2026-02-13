import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UploadDownloadService } from '../../services/upload-download/upload-download.service';
import { Policy } from '../../private-area.model';
import { Subject } from 'rxjs';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-upload-download',
    templateUrl: './upload-download.component.html',
    styleUrls: ['./upload-download.component.scss'],
    standalone: false
})
export class UploadDownloadComponent implements OnInit, OnChanges {
  @Input() policy: Policy;

  private uploadCaptionTextSubject = new Subject<
  {  private_area_upload_excel_button: string
   , private_area_download_template_link: string
 }
 >();

 private downloadCaptionTextSubject = new Subject<
  { private_area_download_file: string }>();

  uploadCaptionText$ = this.uploadCaptionTextSubject.asObservable();
  downloadCaptionText$ = this.downloadCaptionTextSubject.asObservable();
  constructor(public uploadDownloadService: UploadDownloadService,
              private kenticoTranslateService: KenticoTranslateService,
  ) {
    this.subscribeToStateObservables();
  }
  state: any;
  uploadCaptionText: any;
  downloadCaptionText: any;
  private subscribeToStateObservables() {
    this.uploadDownloadService.uploadDownloadState$.subscribe(state => { this.state = state;
      this.loadCaptionsText();
    });
    this.uploadCaptionText$.subscribe(captionText => {
      this.uploadCaptionText = captionText;
    });
    this.downloadCaptionText$.subscribe(captionText => {
      this.downloadCaptionText = captionText;
    });
  }

  private createUploadCaptionTextInitialState(): void {
    this.kenticoTranslateService.getItem('private_area').subscribe( kenticoItem => {
      const item = kenticoItem as any;
      const errorMessages = [];
      item.error_messages.value.forEach(errorLabel => {
        errorMessages[errorLabel.system.codename] = errorLabel.text.value;
      });
      const state = {
        private_area_upload_excel_button: item.upload_file.value
      , private_area_download_template_link: item.download_template.value
      , private_area_upload_errors: errorMessages,
        private_area_success_message: item.success_message.value
      };
      this.uploadCaptionTextSubject.next(state);
    });
  }

  createDownloadCaptionTextInitialState(): void {
    this.kenticoTranslateService.getItem('private_area').subscribe( kenticoItem => {
      const item = kenticoItem as any;
      const state = {
        private_area_download_file: item.download_excel.value
      };
      this.downloadCaptionTextSubject.next(state);
    });
  }


  ngOnInit() {
  }

  ngOnChanges() {
    this.uploadDownloadService.selectedPolicyChanged(this.policy);
  }

  private loadCaptionsText() {
    if (this.state) {
      if (this.state.showUpload && !this.uploadCaptionText) {
        this.createUploadCaptionTextInitialState();
      }
      if (this.state.showDownload && !this.downloadCaptionText) {
        this.createDownloadCaptionTextInitialState();
      }
    }
  }
  public onUploadFileEvent(file: File) {
      this.uploadDownloadService.uploadFile(file, this.policy);
  }

  public onSelectedFileEvent(file: File) {
    this.uploadDownloadService.setSelectedFileForUploading(file);
  }
}

