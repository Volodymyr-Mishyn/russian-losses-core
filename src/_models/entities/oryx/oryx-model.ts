export interface Statistics {
  count: number;
  destroyed: number;
  damaged: number;
  abandoned: number;
  captured: number;
}

export interface EntityStatusInfo {
  count: number;
  list: Array<string>;
}

export interface EntityModel {
  //t-90
  name: string;
  count: number;
  description?: string;
  image?: string;
  countryName: string;
  entityType: string;
  destroyed: EntityStatusInfo;
  damaged: EntityStatusInfo;
  captured: EntityStatusInfo;
  abandoned: EntityStatusInfo;
  damagedAndCaptured: EntityStatusInfo;
  damagedAndAbandoned: EntityStatusInfo;
}

export interface EntityType {
  //tanks
  name: string;
  countryName: string;
  description?: string;
  image?: string;
  statistics: Statistics;
  entities: Array<EntityModel>;
}

export interface OryxSideLosses {
  //Russia
  name: string;
  countryName: string;
  date: Date;
  image?: string;
  statistics: Statistics;
  entityTypes: Array<EntityType>;
}
