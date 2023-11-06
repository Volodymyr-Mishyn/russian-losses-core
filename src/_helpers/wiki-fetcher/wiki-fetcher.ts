export class WikiFetcher {
  private static _instance: WikiFetcher | null = null;
  private _wikiEndpoint = 'https://en.wikipedia.org/w/api.php';
  private constructor() {}
  public static getInstance() {
    if (!WikiFetcher._instance) {
      WikiFetcher._instance = new WikiFetcher();
    }
    return WikiFetcher._instance;
  }

  public async searchTerm(searchTerm: string) {
    const queryParams = new URLSearchParams({
      format: 'json',
      action: 'query',
      prop: 'info|pageimages',
      inprop: 'url',
      piprop: 'original',
      titles: searchTerm,
    });
    const url = `${this._wikiEndpoint}?${queryParams.toString()}`;
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      const pageId = Object.keys(data.query.pages)[0];
      const page = data.query.pages[pageId];

      if (page) {
        console.log(page);
        const title = page.title;
        const pageUrl = page.fullurl;
        const imageUrl = page.original ? page.original.source : '';

        console.log(`Entity: ${title}`);
        console.log(`Wikipedia URL: ${pageUrl}`);
        console.log(`Image URL: ${imageUrl}`);
        console.log('---');
      } else {
        console.log(`Entity "${searchTerm}" not found on Wikipedia.`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
