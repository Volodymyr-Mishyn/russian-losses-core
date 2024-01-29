export class OryxTypeNameMarshaller {
  private static _instance: OryxTypeNameMarshaller | null = null;
  private constructor() {}
  public static getInstance() {
    if (!OryxTypeNameMarshaller._instance) {
      OryxTypeNameMarshaller._instance = new OryxTypeNameMarshaller();
    }
    return OryxTypeNameMarshaller._instance;
  }

  public marshall(name: string): string {
    return name.toLowerCase().trim().replace(/\s+/g, '_');
  }
  public deMarshall(name: string): string {
    return name.toLowerCase().trim().replace(/_/g, ' ');
  }
}
