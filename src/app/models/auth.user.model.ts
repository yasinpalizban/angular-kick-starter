import {BasicModel} from "./basic.model";

export class AuthUser extends BasicModel {
  public username: string | undefined;
  public jwt: string[] | undefined;
  public role: string | undefined;
  public permissionGroup: string[] | undefined;
  public permissionUser: string[] | undefined;

  constructor(init?: Partial<AuthUser>
  ) {
    super();

  }
}
