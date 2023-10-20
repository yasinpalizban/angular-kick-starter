import {Observable} from 'rxjs';
import {IQuery} from './query.interface';
import {ResponseObject} from "./response.object.interface";

export declare interface IApiService<T> {
  get(argument?: number | string | object): Observable<ResponseObject<T>>;
  post(data: any): Observable<ResponseObject<T>>;
  put(data: any): Observable<ResponseObject<T>>;
  postAsync(data: any): Promise<ResponseObject<T>| void>;
  delete(id: number, foreignKey?: number): Observable<ResponseObject<T>>;
  getDataObservable(): Observable<ResponseObject<T>>;
  getQueryArgumentObservable(): Observable<IQuery>;
  setQueryArgument(queries: IQuery): void;
  clearAlert(): void;
  unsubscribe(): void;
}
