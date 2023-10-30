export interface DataSaver<D> {
  save(data: D): boolean;
}
