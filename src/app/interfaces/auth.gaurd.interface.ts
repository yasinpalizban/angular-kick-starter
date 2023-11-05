import {IBasic} from "./ibasic.interface";

export interface IRoleGuard  extends  IBasic{
  name: string,
}

export interface IPermissionGuard  extends  IBasic{
  name: string,
  description: string,
  active: number
}

export interface IPermissionGroupGuard extends  IBasic {
  groupId: number,
  permissionId: number,
  actions: string,
  permission: string
}

export interface IPermissionUserGuard  extends  IBasic{
  userId: number,
  permissionsId: number,
  actions: string,
  permission: string,
}
