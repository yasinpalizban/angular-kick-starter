import {IPagination} from "./ipagination";

export interface IResponseObject<T> {
  pager?: IPagination;
  data:  T;
  insertId?: number;
  success?: boolean;
  statusMessage?: string
}
