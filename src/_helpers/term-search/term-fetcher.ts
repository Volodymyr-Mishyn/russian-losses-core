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
      console.error(`Error fetching Wikipedia data: ${error}`);
      return null;
    }
  }

  public async searchTerm(term: string): Promise<TermData | null> {
    try {
      const results = await this._google.searchTerm(term);
      if (!results || results.length === 0) {
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
            return {
              ...wikiData,
              description: [...(wikiData.description || []), wikiSnippet.snippet],
              images,
            };
          }
        }
      }
      return googleImages.length > 0 ? { images: googleImages } : null;
    } catch (error) {
      console.error(`Error processing search results: ${error}`);
      return null;
    }
  }
}
