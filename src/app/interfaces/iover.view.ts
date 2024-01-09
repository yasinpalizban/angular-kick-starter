import {IUser} from "./iuser";

export interface IOverView {
  userPost?: IUser[],
  countPost?: {
    users: number,
    contacts: number,
    news: number,
    visitors: number,

  };
}
