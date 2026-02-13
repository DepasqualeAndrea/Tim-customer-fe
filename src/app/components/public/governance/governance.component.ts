import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {ContentItem, ContentItemIndexer} from 'kentico-cloud-delivery';
import {
  DocumentCard,
  DocumentCardSection,
  GovernanceContent,
  GovernanceSection, LogoSection,
  Year,
  YearSection
} from './governance-content.model';
import { PreventivatoreDynamicSharedFunctions } from '../../../modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-dynamic-shared-functions';



@Component({
    selector: 'app-governance',
    templateUrl: './governance.component.html',
    styleUrls: ['./governance.component.scss'],
    standalone: false
})
export class GovernanceComponent implements OnInit, OnDestroy {
  content: GovernanceContent;
  collapsed: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }


  ngOnInit() {
    this.getContentFromKentico().subscribe(item => this.mapContent(item));
    window.addEventListener('scroll', this.scrollTop, true);
  }

  private getContentFromKentico(): Observable<ContentItem> {
    return this.kenticoTranslateService.getItem<ContentItem>('governance_yolo').pipe(take(1));
  }

  private mapContent(item: ContentItem): void {

    this.content = {
      title: item?.header?.value,
      subtitle: item?.subtitle?.value,
      sections: this.mapContentSections(item?.sections?.value),
    };
  }

  private mapContentSections(sections: ContentItemIndexer): GovernanceSection[] {
    return sections.map((section) => {
      if (section?.card_years?.value?.length > 0) {
        return this.getYearSectionMapping(section);
      }
      if (section?.cards_pdf_list?.value?.length > 0) {
        return this.getCardSectionContent(section);
      }
      if (section?.logo?.value?.length > 0) {
        return this.getSectionImage(section);
      }
    });
  }

  private getYearSectionMapping(section: ContentItemIndexer): YearSection {
    return {
      title: section?.title?.value,
      years: this.getYearCardsMapping(section?.card_years?.value)
    };
  }

  private getYearCardsMapping(years: ContentItemIndexer): Year[] {
    return years.map((sectionYear, index) => {
      return {
        year: sectionYear?.year?.value,
        collapsed: index === 0,
        cards: this.getDocumentCardMapping(sectionYear?.pdf_list?.value)
      };
    });
  }

  private getDocumentCardMapping(documents: ContentItemIndexer): DocumentCard {
    return documents.map(document => {
      return {
        title: document?.title?.value,
        iconUrl: document?.icon_pdf?.value[0]?.url,
        description: document?.link_text?.value,
        downloadLink: document?.link_url?.value,
      };
    });
  }

  getCardSectionContent(section: ContentItemIndexer): DocumentCardSection {
    return {
      title: section?.title?.value,
      description: section?.description?.value,
      cards: this.getCardPdfList(section?.cards_pdf_list?.value),
    };
  }

  private getCardPdfList(pdfList: ContentItemIndexer): DocumentCard {
    return pdfList.map(pdf => {
      return {
        title: pdf?.title?.value,
        description: pdf?.description ? pdf?.description?.value : '',
        iconPdf: pdf?.icon_pdf ? pdf?.icon_pdf?.value[0]?.url : '',
        linkText: pdf?.link_text ? pdf?.link_text?.value : '',
        downloadLink: pdf?.link_url ? pdf?.link_url?.value : '',
      };
    });
  }

  changeText(i, years) {
    years.forEach((year) => {
      if (year === years[i]) {
      year.collapsed ? year.collapsed = false : year.collapsed = true;
      } else {
        year.collapsed = false;
      }
    });
  }

  private getSectionImage(img: ContentItemIndexer): LogoSection {
      return {
        title: img?.title?.value,
        description: img?.description?.value,
        logo:  img?.logo?.value[0]?.url
      };
    }

   isEmptyText(text: string): boolean {
     return PreventivatoreDynamicSharedFunctions.isEmptyText(text);
  }
  scrollTop($event) {
    const myButton = document.getElementById('scroll-btn');
    const doc = document.documentElement;
    const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    if (
      top > 800
    ) {
      myButton.style.display = 'block';
    } else {
      myButton.style.display = 'none';
    }
  }
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollTop, true);
  }

  scroll(id: any) {
    const el = document.getElementById(id);
    el.scrollIntoView({block: 'nearest', inline: 'center', behavior: 'smooth'});
  }


}

