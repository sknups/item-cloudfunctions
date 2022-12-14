export class AuditEntity {
  public date: Date;
  public details: string | null;
  public entityId: string;
  public fromState: string | null;
  public toState: string;
}
