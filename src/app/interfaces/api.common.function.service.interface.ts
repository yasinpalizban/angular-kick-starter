import {Observable} from "rxjs";

export declare interface IApiCommonFunction {
  query(argument?: number | string | object):  Observable<any> |void;

  save?: (data: any) => Promise<any|void> | void|Observable<any> ;

  update?: (data: any) => Promise<any|void> | void|Observable<any> ;

  remove?(id: number, foreignKey?: number): void;

}
