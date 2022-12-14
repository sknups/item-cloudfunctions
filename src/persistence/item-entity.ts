export class ItemEntity {
  public brandCode: string;
  public brandName: string;
  public brandWholesalePrice: number | null;
  public brandWholesalerShare: number; //float
  public card: string | null;
  public certVersion: string;
  public claimCode: string | null;
  public created: Date;
  public description: string;
  public emailHash: string;
  public user: string;
  public flexHost: string;
  public maxQty: number | null;
  public nftAddress: string | null;
  public nftState: string;
  public ownerAddress: string | null;
  public platformCode: string;
  public recommendedRetailPrice: number | null;
  public saleQty: number | null;
  public sknappHost: string;
  public source: string;
  public state: string;
  public stockKeepingUnitCode: string;
  public stockKeepingUnitName: string;
  public stockKeepingUnitRarity: number | null;
  public tier: string | null;
  public skn: string;
  public updated: Date;
  public version: string;
}

export class ItemEntityData {

  constructor(
      public thumbprint: string,        
      public readonly saleQty: number,
      public readonly maxQty: number,
      public readonly stockKeepingUnitName: string,
      public readonly description: string,
      public readonly emailHash: string | null,
      public readonly user: string,
      public readonly brandCode: string,
      public readonly platformCode: string,
      public readonly stockKeepingUnitCode: string,
      public readonly source: string,
      public readonly claimCode: string | null,
      public readonly tier: string | null,
      public readonly recommendedRetailPrice: number,
      public readonly nftState: string,
      public readonly created: number,
      public readonly stockKeepingUnitRarity: number | null,
      public readonly card: string | null,
      public readonly version: string,
      public readonly skn: string,
  ) { }
}
