export class Auth {
  public username: string | undefined;
  public email: string | undefined;
  public password: string | undefined;
  public passConfirm: string | undefined;
  public login: string | undefined;
  public remember: boolean | undefined;
  public token: string | undefined;
  public resetToken: string | undefined;
  public activeToken: string | undefined;
  public phone: number | undefined;
  public action: string | undefined;
  public socialLogin: string | undefined;

  constructor(init?: Partial<Auth>) {
    Object.assign(this, init);
  }
}
