export class Permission {

  public id: number | undefined;
  public name: string | undefined;
  public active: boolean | undefined;
  public description: string | undefined;

  constructor(init?: Partial<Permission>) {
    Object.assign(this, init);
  }
}