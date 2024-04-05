import { SourceTypes } from '../scrapping-parameters';

export interface InnerScrapResult<D> {
  date: string;
  type: SourceTypes;
  data: D;
}

export interface ScrapResult<D> {
  success: boolean;
  result: InnerScrapResult<D>;
}
