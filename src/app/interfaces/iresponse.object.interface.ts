import {IPagination} from "./ipagination.interface";

export interface IResponseObject<T> {
  pager?: IPagination;
  data?: any| any[]| T[] | T;
  insertId?: number;
  success?: boolean;
  statusMessage?: string
}
