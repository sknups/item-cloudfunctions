import { NamedKeyEntity } from '../helpers/persistence/base.entity';
import { UpdateableEntity } from '../helpers/persistence/updateable.entity';

export const ITEM_PROJECTION = [
  'brandCode',
  'card',
  'claimCode',
  'created',
  'description',
  'emailHash',
  'maxQty',
  'nftState',
  'ownerAddress',
  'platformCode',
  'recommendedRetailPrice',
  'saleQty',
  'skn',
  'source',
  'state',
  'stockKeepingUnitCode',
  'stockKeepingUnitName',
  'stockKeepingUnitRarity',
  'tier',
  'user',
  'version',
];

export type ProjectedItemEntity = NamedKeyEntity & {

  brandCode: string;
  card: string | null;
  claimCode: string | null;
  created: Date;
  description: string;
  emailHash: string;
  maxQty: number | null;
  nftState: string;
  ownerAddress: string | null;
  platformCode: string;
  recommendedRetailPrice: number | null;
  saleQty: number | null;
  skn: string;
  source: string;
  state: string;
  stockKeepingUnitCode: string;
  stockKeepingUnitName: string;
  stockKeepingUnitRarity: number | null;
  tier: string | null;
  user: string;
  version: string;

}

export type ItemEntity = ProjectedItemEntity & UpdateableEntity & {

  brandName: string;
  brandWholesalePrice: number | null;
  brandWholesalerShare: number; //float
  certVersion: string;
  flexHost: string;
  nftAddress: string | null;
  sknappHost: string;

}