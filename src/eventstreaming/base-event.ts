import { IsNotEmpty, IsString } from 'class-validator';

export abstract class BaseEvent {
  @IsString()
  @IsNotEmpty()
  public eventId: string;

  @IsString()
  @IsNotEmpty()
  public dataEvent: string;

  public abstract getDataType(): string;
}
