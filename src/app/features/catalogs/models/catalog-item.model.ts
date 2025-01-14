export enum CatalogItemType {
  COMPONENT = 'Component',
  TEMPLATE = 'Template',
}

export interface CatalogItem {
  catalogName?: string;
  name: string;
  type: CatalogItemType;
  icon: string;
  description?: string;
  home?: string;
}
