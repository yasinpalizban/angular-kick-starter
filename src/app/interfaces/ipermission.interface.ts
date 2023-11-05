import {IBasic} from "./ibasic.interface";

export interface IPermission extends  IBasic {
    id: number,
    name: string,
    active: boolean,
    description: string,
}
