import {IUser} from "./user.interface";

export interface IOverView {
  user?: IUser[],
  countPost?: {
    users: number,
    contacts: number,
    news: number,
    visitors: number,

  };
}
