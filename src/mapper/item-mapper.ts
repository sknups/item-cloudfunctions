import { ItemDTO, ItemNFTState, ItemSource } from "../dto/get-items-response.dto";
import { ItemEntityData } from "../persistence/item-entity";
import { ItemMediaDTOMapper } from "./item-media-mapper";

export class ItemDTOMapper {

    private mediaMapper: ItemMediaDTOMapper;

    private flexHost: string;

    private sknappHost: string;

    constructor(
        assetsHost: string,
        flexHost: string,
        sknappHost: string
    ) {
        this.mediaMapper = new ItemMediaDTOMapper(assetsHost);
        this.flexHost = flexHost;
        this.sknappHost = sknappHost;
    }

    toDTO(entity: ItemEntityData): ItemDTO {

        const created = new Date(entity.created / 1000).toISOString()

        const certVersion = 'v1';

        return new ItemDTO(
            entity.thumbprint,
            this.flexHost,
            entity.card,
            this.sknappHost,
            certVersion,
            entity.saleQty,
            entity.maxQty,
            ItemSource[entity.source],
            ItemNFTState[entity.nftState],
            entity.claimCode,
            entity.stockKeepingUnitName,
            entity.description,
            entity.brandCode,
            entity.platformCode,
            entity.stockKeepingUnitCode,
            entity.tier,
            entity.recommendedRetailPrice,
            created,
            entity.stockKeepingUnitRarity,
            entity.version,
            this.mediaMapper.toDTO(
                this.flexHost,
                entity.stockKeepingUnitCode,
                entity.skn,
                entity.thumbprint
            )
        );
    }
}