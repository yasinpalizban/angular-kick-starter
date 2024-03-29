import {Observable} from 'rxjs';
import {IQuery} from './iquery';
import {IResponseObject} from "./iresponse.object";

export declare interface IApiService<T> {
  get(argument?: number | string | object): Observable<IResponseObject<T[]>>;
  show(argument: number): Observable<IResponseObject<T>>;
  post(data: any): Observable<IResponseObject<T>>;
  put(data: any): Observable<IResponseObject<T>>;
  delete(id: number, foreignKey?: number): Observable<IResponseObject<T>>;
  getDataObservable(): Observable<IResponseObject<T>>;
  getQueryArgumentObservable(): Observable<IQuery>;
  setQueryArgument(queries: IQuery): void;
  clearAlert(): void;
  unsubscribe(): void;
}
