import {IPagination} from "./pagination.interface";

export interface IPermissionGroup {


  pager?:IPagination;
  data?: [{
    id: number,
    permissionId: number,
    groupId: number,
    actions: string,
    permission: string,
    group: string,
  }];

}
