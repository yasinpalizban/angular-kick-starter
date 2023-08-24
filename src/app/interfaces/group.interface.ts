import {IPagination} from "./pagination.interface";

export interface IGroup {


  pager?:IPagination;
  data?: [{
    id: number,
    name: string,
    description: string,
  }];

}
