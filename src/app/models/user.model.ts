export class User {

  public id: number | undefined;
  public username: string | undefined;
  public email: string | undefined;
  public firstName: string | undefined;
  public lastName: string | undefined;
  public phone: string | undefined;
  public password: string | undefined;
  public groupId: number | undefined;
  public active: boolean | undefined;
  public status: boolean | undefined;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
