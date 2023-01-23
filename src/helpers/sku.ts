import { AppError, SKU_NOT_FOUND, SKU_NOT_SUPPORTED_GIVEAWAY, SKU_NOT_SUPPORTED_PURCHASE } from "../app.errors";
import { getSku, Sku } from "../client/catalog/catalog.client";
import { AllConfig } from "../config/all-config";

export async function getSkuOrThrow(cfg: AllConfig, skuCode: string): Promise<Sku> {
    const sku: Sku | null = await getSku(cfg, skuCode);
    if (!sku) {
        throw new AppError(SKU_NOT_FOUND(skuCode));
    }
    return sku;
}


export async function _retrieveAndValidateGiveawaySku(cfg: AllConfig, skuCode: string): Promise<Sku> {
    const sku: Sku = await getSkuOrThrow(cfg, skuCode);
    if (sku.version == '1' || sku.maxQty) {
        throw new AppError(SKU_NOT_SUPPORTED_GIVEAWAY(skuCode));
    }
    return sku;
}

export async function _retrieveAndValidatePurchaseSku(cfg: AllConfig, skuCode: string): Promise<Sku> {
    const sku: Sku = await getSkuOrThrow(cfg, skuCode);
    if (!sku.maxQty || !sku.permissions.includes('SELL')) {
        throw new AppError(SKU_NOT_SUPPORTED_PURCHASE(skuCode));
    }
    return sku;
}