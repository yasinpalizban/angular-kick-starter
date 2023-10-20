import {BasicModel} from "./basic.model";

export class Profile extends BasicModel {

  public firstName: string | undefined;
  public lastName: string | undefined;
  public phone: string | undefined;
  public address: string | undefined;
  public password: string | undefined;
  public passConfirm: string | undefined;
  public gender: string | undefined;
  public country: string | undefined;
  public city: string | undefined;
  public image: File | undefined;
  public bio: string | undefined;
  public title: string | undefined;

  constructor(init?: Partial<Profile>) {
    super();
    Object.assign(this, init);
  }
}
