import {IUser} from "./iuser.interface";

export interface IOverView {
  user?: IUser[],
  countPost?: {
    users: number,
    contacts: number,
    news: number,
    visitors: number,

  };
}
