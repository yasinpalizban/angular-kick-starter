import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {AlertService} from './alert.service';
import {catchError, filter} from 'rxjs/operators';
import {IQuery} from '../interfaces/query.interface';
import {TranslateService} from '@ngx-translate/core';
import {IApiService} from '../interfaces/api.service.interface';
import {ResponseObject} from "../interfaces/response.object.interface";
import {queryParamType} from "../utils/query.param.type";

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> implements IApiService<T> {
  private queryArgument: BehaviorSubject<IQuery> = new BehaviorSubject<IQuery>({});
  protected dataSubject: BehaviorSubject<ResponseObject<T>> = new BehaviorSubject<any>(null);
  protected messageCreate!: string;
  protected messageUpdate!: string;
  protected messageDelete!: string;
  protected subscription: Subscription[]=[];
  public insertId: number | undefined=0;
  protected pageUrl: string='';
  protected alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false,
    body: []

  };
  constructor(protected httpClient: HttpClient,
              protected alertService: AlertService,
              protected translate: TranslateService) {
    this.messageCreate=this.translate.instant('common.messageCreate');
    this.messageUpdate=this.translate.instant('common.messageUpdate');
    this.messageDelete=this.translate.instant('common.messageDelete');

  }
  public get(argument?: number | string | object|null): Observable<ResponseObject<T>> {
    const {params, queries} = queryParamType(argument);
    return this.httpClient
      .get<T>(this.pageUrl + queries,
        {
          params
        });
  }

  public post(data: any): Observable<ResponseObject<T>> {

    return this.httpClient.post<T>(this.pageUrl, data);

  }

  public put(data: any): Observable<ResponseObject<T>> {

    if (data instanceof FormData) {

      return this.httpClient.post<T>(this.pageUrl + '/' + data.get('id'), data);
    } else {

      return this.httpClient.put<T>(this.pageUrl + '/' + data.id, data);
    }

  }

  public delete(id: number, foreignKey?: number): Observable<ResponseObject<T>> {
    let params;
    if (foreignKey !== undefined) {
      params = new HttpParams().append('foreignKey', foreignKey.toString());
    }
    return this.httpClient.delete<T>(this.pageUrl + '/' + id, {params});
  }

  public async postAsync(data: any): Promise<ResponseObject<T>| void> {
    return this.httpClient.post<T>(this.pageUrl, data)
      .toPromise().catch((error) => {
        console.log(error);
        this.insertId = 0;


      });
  }


  getDataObservable(): Observable<ResponseObject<T>> {
    return this.dataSubject.asObservable().pipe(filter(result => !!result));
  }

  getQueryArgumentObservable(): Observable<IQuery> {
    return this.queryArgument.asObservable().pipe(filter(result => !!result));
  }

  setQueryArgument(queries: IQuery): void {
    this.queryArgument.next(queries);
  }


  clearAlert(): void {
    this.alertService.clear();
  }

  unsubscribe(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

}
