import {IPagination} from "./pagination.interface";

export interface IPermission {


  pager?:IPagination;
  data?: [{
    id: number,
    name: string,
    active: boolean,
    description: string,
  }];

}
