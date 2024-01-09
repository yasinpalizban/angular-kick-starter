import {Observable} from "rxjs";
import {IQuery} from "./iquery";

export declare interface IApiCommonFunction {
  retrieve(argument?: number | string | object):  Observable<any> |void;

  detail?(argument: number):  Observable<any> |void;

  save?: (data: any) => Promise<any|void> | void|Observable<any> ;

  update?: (data: any,params?: IQuery) => Promise<any|void> | void|Observable<any> ;

  remove?(id: number, foreignKey?: number): void;

}
