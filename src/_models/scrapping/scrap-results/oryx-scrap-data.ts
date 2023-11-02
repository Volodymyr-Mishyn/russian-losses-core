export interface OryxStat {
  count: number;
  destroyed: number;
  damaged: number;
  abandoned: number;
  captured: number;
}

export interface OryxStatRoot {
  name: string;
  statistics: OryxStat;
}

export interface OryxDetailedEntityCategoryInfo {
  count: number;
  list: Array<string>;
}

export interface OryxDetailedEntityInfo {
  destroyed: OryxDetailedEntityCategoryInfo;
  damaged: OryxDetailedEntityCategoryInfo;
  captured: OryxDetailedEntityCategoryInfo;
  abandoned: OryxDetailedEntityCategoryInfo;
  damagedAndCaptured: OryxDetailedEntityCategoryInfo;
  damagedAndAbandoned: OryxDetailedEntityCategoryInfo;
}

export interface OryxDetailedEntity extends OryxDetailedEntityInfo {
  name: string;
  count: number;
}

export interface OryxEntityType extends OryxStatRoot {
  details: Array<OryxDetailedEntity>;
}

export interface OryxScrapData extends OryxStatRoot {
  entities: Array<OryxEntityType>;
}
