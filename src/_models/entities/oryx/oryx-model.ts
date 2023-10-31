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
  destroyed: EntityStatusInfo;
  damaged: EntityStatusInfo;
  captured: EntityStatusInfo;
  abandoned: EntityStatusInfo;
  damagedAndCaptured: EntityStatusInfo;
  damagedAndAbandoned: EntityStatusInfo;
}

export interface EntityType {
  //tank
  name: string;
  description?: string;
  image?: string;
  statistics: Statistics;
  details: Array<EntityModel>;
}

export interface OryxSideLosses {
  //Russia
  name: string;
  date: Date;
  image?: string;
  statistics: Statistics;
  entities: Array<EntityType>;
}
