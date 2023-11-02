export interface DataSaver<D> {
  save(data: D): Promise<boolean>;
}
