import { NamedKeyEntity } from '../helpers/persistence/base.entity';
import { UpdateableEntity } from '../helpers/persistence/updateable.entity';

export type ItemEntity = NamedKeyEntity & UpdateableEntity & {

  brandCode: string;
  brandName: string;
  brandWholesalePrice: number | null;
  brandWholesalerShare: number; //float
  card: string | null;
  claimCode: string | null;
  description: string;
  maxQty: number | null;
  media: string | null;
  nftAddress: string | null;
  nftState: string;
  ownerAddress: string | null;
  platformCode: string;
  recommendedRetailPrice: number | null;
  saleQty: number | null;
  issue: number | null;
  issued: number | null;
  skn: string | null;
  source: string;
  state: string;
  stockKeepingUnitCode: string;
  stockKeepingUnitName: string;
  stockKeepingUnitRarity: number | null;
  tier: string | null;
  user: string | null;
  version: string;

}
