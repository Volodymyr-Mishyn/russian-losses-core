import { GoogleData, GoogleFetcher } from './google-fetcher';
import { WikiFetcher } from './wiki-fetcher';

export interface TermData {
  title?: string;
  description?: Array<string>;
  images?: Array<string>;
  url?: string;
}

export class TermFetcher {
  private static _instance: TermFetcher | null = null;
  private _google = GoogleFetcher.getInstance();
  private _wiki = WikiFetcher.getInstance();
  private _cache: Map<string, TermData | null> = new Map();
  private constructor() {}
  public static getInstance() {
    if (!TermFetcher._instance) {
      TermFetcher._instance = new TermFetcher();
    }
    return TermFetcher._instance;
  }

  private _extractGoogleImages(results: Array<GoogleData>): string[] {
    return results
      .map(({ pagemap }) => pagemap?.cse_image?.[0]?.src)
      .filter(Boolean)
      .slice(0, 3);
  }

  private async _fetchWikiData(term: string): Promise<Partial<TermData> | null> {
    try {
      const wikiData = await this._wiki.searchTerm(term);
      if (!wikiData) return null;

      const { title, description, summary, imageUrl, url } = wikiData;
      const images = imageUrl ? [imageUrl] : [];
      return { title, description: [description, summary], images, url };
    } catch (error) {
      console.error(`Error parsing Wikipedia data TERM: ${term}; ERROR: ${error}`);
      return null;
    }
  }

  public async searchTerm(term: string): Promise<TermData | null> {
    if (this._cache.has(term)) {
      return this._cache.get(term) || null;
    }
    let result: TermData | null = null;
    try {
      const results = await this._google.searchTerm(term);
      if (!results || results.length === 0) {
        this._cache.set(term, null);
        return null;
      }
      const googleImages = this._extractGoogleImages(results);
      const wikiSnippet = results.find((result) => result.link.includes('wikipedia.org'));

      if (wikiSnippet) {
        const actualQuery = wikiSnippet?.link.split('/').pop();
        if (actualQuery) {
          const wikiData = await this._fetchWikiData(actualQuery);
          if (wikiData) {
            const images =
              Array.isArray(wikiData.images) && wikiData.images?.length > 0
                ? [...wikiData.images, ...googleImages]
                : googleImages;
            result = {
              ...wikiData,
              description: [...(wikiData.description || []), wikiSnippet.snippet],
              images,
            };
          } else {
            result = { url: wikiSnippet.link, images: googleImages };
          }
        } else {
          result = { url: wikiSnippet.link, images: googleImages };
        }
      } else {
        result = googleImages.length > 0 ? { images: googleImages } : null;
      }
    } catch (error) {
      console.error(`Error processing search ${term} results: ${error}`);
      result = null;
    }
    this._cache.set(term, result);
    return result;
  }
}
