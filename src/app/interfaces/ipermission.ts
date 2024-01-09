import {IBasic} from "./ibasic";

export interface IPermission extends  IBasic {
    id: number,
    name: string,
    active: boolean,
    description: string,
}
