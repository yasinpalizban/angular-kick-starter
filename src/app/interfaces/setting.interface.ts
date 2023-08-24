import {IPagination} from "./pagination.interface";

export interface ISetting {

  pager?:IPagination;
  data?: [{
    id: number,
    key: string,
    value: string,
    description: string,
    status: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  }];

}
