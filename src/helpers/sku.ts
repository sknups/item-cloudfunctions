import { AppError, SKU_NOT_FOUND } from "../app.errors";
import { getSku, Sku } from "../client/catalog/catalog.client";
import { AllConfig } from "../config/all-config";

export async function getSkuOrThrow(cfg: AllConfig, skuCode: string): Promise<Sku> {
  const sku: Sku | null = await getSku(cfg, skuCode);
  if (!sku) {
    throw new AppError(SKU_NOT_FOUND(skuCode));
  }
  return sku;
}
