import {IPagination} from "./pagination.interface";

export interface IPermissionUser {

  pager?:IPagination;
  data?: [{
    id: number,
    permissionId: number,
    userId: number,
    actions: string,
    permission: string,
    username: string,
    firstName: string,
    lastName: string,
  }];

}
