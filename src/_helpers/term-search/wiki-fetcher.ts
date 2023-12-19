export interface WikiData {
  imageUrl: string | null;
  summary: string;
  url: string;
  title: string;
  description: string;
}

export class WikiFetcher {
  private static _instance: WikiFetcher | null = null;
  private _endpoint = 'https://en.wikipedia.org/api/rest_v1/page/summary';
  private constructor() {}
  public static getInstance() {
    if (!WikiFetcher._instance) {
      WikiFetcher._instance = new WikiFetcher();
    }
    return WikiFetcher._instance;
  }

  public async searchTerm(searchTerm: string): Promise<WikiData | null> {
    const url = `${this._endpoint}/${encodeURIComponent(searchTerm)}`;
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      const imageUrl = data.thumbnail ? data.thumbnail.source : null;
      const title = data.title;
      const description = data.description;
      const summary = data.extract;
      const wikiUrl = data.content_urls.desktop.page;
      return { imageUrl, summary, url: wikiUrl, title, description };
    } catch (error) {
      console.error(`Error fetching data for ${searchTerm}: ${error}`);
      return null;
    }
  }
}
