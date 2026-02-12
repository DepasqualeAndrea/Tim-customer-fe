export type GovernanceContent = {
  title: string
  sections: GovernanceSection[],
  subtitle?: string,
  image?: LogoSection
};

export type GovernanceSection = YearSection | DocumentCardSection | LogoSection;

export type YearSection = {
  title?: string
  years?: Year[],
};
export type LogoSection = {
  logo?: any,
  title?: any,
  description?: string,
};
export type Year = {
  year: string
  collapsed: boolean,
  cards: DocumentCard[],
};

export type DocumentCardSection = {
  title?: any
  description?: string
  cards?: DocumentCard[] | DocumentCardSection,
};

export type DocumentCard = {
  description?: string
  title?: string,
  iconUrl: string
  downloadLink: string,
};
