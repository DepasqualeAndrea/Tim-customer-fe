import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-upload-excel',
    templateUrl: './upload-excel.component.html',
    styleUrls: ['./upload-excel.component.scss'],
    standalone: false
})
export class UploadExcelComponent implements OnInit {
  @Output() uploadFileEvent = new EventEmitter<File>();
  @Output() selectedFileEvent = new EventEmitter<File>();
  @Input() captionText: {
    private_area_upload_excel_button: string,
    private_area_download_template_excel: string,
    private_area_upload_errors: any[],
    private_area_success_message: string
  };
  @Input() state: {
    isUploadDisabled?: boolean
    , loading?: boolean
    , errorMessage?: string
    , selectedFile?: File
    , successMessage?: string
    , resultUploadedFile?:
    {
      result?: string
      , successMessage?: string
      , errors?: any[]
    }
  };

  ngOnInit() {
  }

  createErrorMessage(error: any) {
    const mappedError = this.captionText.private_area_upload_errors[error.errorValidationCode.toLowerCase()];
    const errorText = mappedError ? mappedError : error.errorValidationCode.toLowerCase();

    return !error.subjectIndex ?
       errorText :
      this.captionText.private_area_upload_errors['index_error'] +
      ' ' + error.subjectIndex + ' ' +
      errorText
      ;
  }

  setSelectedFile(event) {
    this.selectedFileEvent.emit(event.target.files[0]);
  }

  uploadFile() {
    this.uploadFileEvent.emit(this.state.selectedFile);
  }

}

