export interface DataProcessor<ID, OD> {
  process(data: ID): Promise<OD>;
}
