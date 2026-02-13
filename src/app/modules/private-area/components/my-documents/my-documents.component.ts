import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { DataService, InsurancesService } from '@services';
import { Subscription } from 'rxjs';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take, map } from 'rxjs/operators';
import { Document, RelatedDocuments, PolicyStatus } from './documents.model';


@Component({
    selector: 'app-my-documents',
    templateUrl: './my-documents.component.html',
    styleUrls: ['./my-documents.component.scss'],
    standalone: false
})
export class MyDocumentsComponent implements OnInit, OnDestroy {
  selectedDoc: Document;
  selectedFilter = 'all';
  documentsList: Document[];
  relatedDocuments: RelatedDocuments[];
  subscriptions: Subscription[] = [];

  kenticoValue: any;
  constructor(
    private insuranceService: InsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService
  ) {}
  ngOnInit() {
    this.getTextKentico();
    this.getMyDocuments();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  onSelectDocument(document: any) {
    this.selectedDoc = document;
    this.filterRelatedDocument('all');
  }
  getTextKentico() {
    this.kenticoTranslateService
      .getItem<any>('private_area')
      .pipe(take(1))
      .subscribe((item) => {
        this.kenticoValue = item;
      });
  }
  getMyDocuments() {
    this.subscriptions.push(
      this.insuranceService.getMyDocuments().subscribe((res) => {
      if (res.documents[0] !== undefined) {
      this.documentsList = res.documents.sort((a, b) =>  b.completed_at.localeCompare(a.completed_at));
      this.onSelectDocument(this.documentsList[0]);
    }}));
  }
  filterRelatedDocument(filter: string) {
    console.log('res.documents', this.documentsList);
    if ( this.documentsList.length > 0) {
      this.selectedFilter = filter;
      if (filter === 'all') {
        this.subscriptions.push(
          this.insuranceService
            .getPolicyNumber(this.selectedDoc.policy_number)
            .subscribe((res) => {
              this.relatedDocuments =
                res.documents.length > 0
                  ? res.documents[0].related_documents
                  : null;
            })
        );
      } else {
        this.subscriptions.push(
          this.insuranceService
            .getFilteredDocuments(this.selectedDoc.policy_number, filter)
            .subscribe((res) => {
              this.relatedDocuments = res.documents[0].related_documents;
            })
        );
      }
    }
  }
  getStatus(status: string): string {
    switch (status) {
      case PolicyStatus.ACTIVE:
        return this.kenticoValue.status_active.value;
      case PolicyStatus.VERIFIED:
        return this.kenticoValue.status_verified.value;
      case PolicyStatus.UNVERIFIED:
        return this.kenticoValue.status_unverified.value;
      case PolicyStatus.EXPIRED:
        return this.kenticoValue.status_expired.value;
      case PolicyStatus.CANCELED:
        return this.kenticoValue.status_canceled.value;
      case PolicyStatus.SUSPENDED:
        return this.kenticoValue.status_suspended.value;
      default:
        break;
    }
  }

}
