export interface Database {
  connect(): Promise<void>;
  setCollection?(collectionName: string): void;
  insertData(data: any): Promise<any>;
  updateData(id: string, data: any): Promise<any>;
  findData(query: any): Promise<any[]>;
  deleteData(id: string): Promise<void>;
}
