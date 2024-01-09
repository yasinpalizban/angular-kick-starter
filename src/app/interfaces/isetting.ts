import {IBasic} from "./ibasic";

export interface ISetting extends  IBasic {

    id: number,
    key: string,
    value: string,
    description: string,
    status: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,

}
