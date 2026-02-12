export interface KenticoTextElement {
  name: string;
  rawData: KenticoTextElementRawData;
  type: string;
  value: string;
}

interface KenticoTextElementRawData {
  name: string;
  type: string;
  value: string;
}