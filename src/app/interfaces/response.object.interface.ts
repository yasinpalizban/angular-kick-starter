import {IPagination} from "./pagination.interface";

export interface ResponseObject<T> {
  pager?: IPagination;
  data?: any| any[]| T[] | T;
  insertId?: number;
  success?: boolean;
  statusMessage?: string
}
