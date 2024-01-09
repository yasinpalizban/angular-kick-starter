import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {AlertService} from './alert.service';
import { filter} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {IApiService} from '../interfaces/api.service.interface';
import {queryParamType} from "../utils/query.param.type";
import {IQuery} from "../interfaces/iquery";
import {IResponseObject} from "../interfaces/iresponse.object";

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> implements IApiService<T> {
  private queryArgument: BehaviorSubject<IQuery> = new BehaviorSubject<IQuery>({});
  protected sharedSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  protected messageCreate!: string;
  protected messageUpdate!: string;
  protected messageDelete!: string;
  protected subscription: Subscription[] = [];
  public insertId: number | undefined = 0;
  protected pageUrl: string = '';
  protected alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false,
    body: []
  };

  constructor(protected httpClient: HttpClient,
              protected alertService: AlertService,
              protected translate: TranslateService) {
    this.messageCreate = this.translate.instant('common.messageCreate');
    this.messageUpdate = this.translate.instant('common.messageUpdate');
    this.messageDelete = this.translate.instant('common.messageDelete');
  }

  public get(argument?: number | string | object | null): Observable<IResponseObject<T[]>> {
    const {params, queries} = queryParamType(argument);
    return this.httpClient
      .get<IResponseObject<T[]>>(this.pageUrl + queries,
        {
          params
        });
  }

  public show(argument?: number): Observable<IResponseObject<T>> {
    return this.httpClient
      .get<IResponseObject<T>>(this.pageUrl + (argument ?  ('/' + argument) :''));
  }


  public post(data: any): Observable<IResponseObject<T>> {
    return this.httpClient.post<IResponseObject<T>>(this.pageUrl, data);
  }

  public put(data: any): Observable<IResponseObject<T>> {
    if (data instanceof FormData) {
      return this.httpClient.post<IResponseObject<T>>(this.pageUrl + '/' + data.get('id'), data);
    } else {
      return this.httpClient.put<IResponseObject<T>>(this.pageUrl + '/' + data.id, data);
    }
  }

  public delete(id: number, foreignKey?: number): Observable<IResponseObject<T>> {
    let params;
    if (foreignKey !== undefined) {
      params = new HttpParams().append('foreignKey', foreignKey.toString());
    }
    return this.httpClient.delete<IResponseObject<T>>(this.pageUrl + '/' + id, {params});
  }

  getDataObservable(): Observable<any> {
    return this.sharedSubject.asObservable().pipe(filter(result => !!result));
  }

  getQueryArgumentObservable(): Observable<IQuery> {
    return this.queryArgument.asObservable().pipe(filter(result => !!result));
  }

  setQueryArgument(queries: IQuery): void {
    this.queryArgument.next(queries);
  }

  setData(data: any): void {
    this.sharedSubject.next(data);
  }


  clearAlert(): void {
    this.alertService.clear();
  }

  unsubscribe(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

}
