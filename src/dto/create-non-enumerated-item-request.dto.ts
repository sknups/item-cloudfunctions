import { IsNotEmpty, IsString } from 'class-validator';
import { CreateEnumeratedItemRequestDTO } from './create-enumerated-item-request.dto';

export class CreateNonEnumeratedItemRequestDTO extends CreateEnumeratedItemRequestDTO {
  /**
   * The claim code used to redeem this giveaway item.
   *
   * @example 'dodecahedron'
   */
  @IsString()
  @IsNotEmpty()
  public readonly claimCode: string;
}
