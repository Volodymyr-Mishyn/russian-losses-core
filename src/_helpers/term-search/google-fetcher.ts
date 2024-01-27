require('dotenv').config();

export interface GoogleData {
  link: string;
  snippet: string;
  pagemap: any;
}

export class GoogleFetcher {
  private static _instance: GoogleFetcher | null = null;
  private _endpoint = 'https://www.googleapis.com/customsearch/v1';
  private constructor() {}
  public static getInstance() {
    if (!GoogleFetcher._instance) {
      GoogleFetcher._instance = new GoogleFetcher();
    }
    return GoogleFetcher._instance;
  }

  public searchAvailable(): boolean {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.GOOGLE_CSE_ID;
    return Boolean(apiKey && cseId);
  }

  public async searchTerm(term: string): Promise<Array<GoogleData> | null> {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.GOOGLE_CSE_ID;
    if (!apiKey || !cseId) {
      return null;
    }
    const url = `${this._endpoint}?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(term)}`;
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      return data.items;
    } catch (error) {
      console.error(`Error during Google CSE search TERM:${term}; ERROR: ${error}`);
      return null;
    }
  }
}
