import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {AlertService} from './alert.service';
import {ErrorService} from './error.service';
import {catchError, filter} from 'rxjs/operators';
import {IQuery} from '../interfaces/query.interface';
import {TranslateService} from '@ngx-translate/core';
import {IApiService} from '../interfaces/api.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> implements IApiService<T> {
  private queryArgument: BehaviorSubject<IQuery>;
  protected dataSubject: BehaviorSubject<T>;
  protected shared: BehaviorSubject<T>;
  protected messageCreate!: string;
  protected messageUpdate!: string;
  protected subscription: Subscription[];
  public insertId: number | undefined;
  protected alertOptions = {
    autoClose: true,
    keepAfterRouteChange: false,
    body: []

  };

  constructor(protected httpClient: HttpClient,
              protected alertService: AlertService,
              protected  errorService: ErrorService,
              @Inject(String) public pageUrl: string,
              protected  translate: TranslateService) {

    this.translate.get('common.messageCreate').subscribe(data => this.messageCreate = data);
    this.translate.get('common.messageUpdate').subscribe(data => this.messageUpdate = data);
    this.subscription = [];
    this.insertId = 0;
    this.queryArgument = new BehaviorSubject<IQuery>({});
    this.dataSubject = new BehaviorSubject<any>(null);
    this.shared = new BehaviorSubject<any>(null);
  }

  public get(argument?: number | string | object): Observable<T> {
    const {params, queries} = this.queryParamType(argument);

    return this.httpClient
      .get<T>(this.pageUrl + queries,
        {
          params
        }).pipe(catchError(error => this.errorService.handleError(error)));

  }

  public post(data: any): Observable<T> {

    return this.httpClient.post<T>(this.pageUrl, data)
      .pipe(catchError(error => this.errorService.handleError(error)));

  }


  public put(data: any): Observable<T> {

    if (data instanceof FormData) {

      return this.httpClient.post<T>(this.pageUrl + '/' + data.get('id'), data)
        .pipe(catchError(error => this.errorService.handleError(error)));
    } else {

      return this.httpClient.put<T>(this.pageUrl + '/' + data.id, data)
        .pipe(catchError(error => this.errorService.handleError(error)));
    }

  }

  public delete(id: number, foreignKey?: number): Observable<T> {
    let params;

    if (foreignKey !== undefined) {
      params = new HttpParams().append('foreignKey', foreignKey.toString());
    }

    return this.httpClient.delete<T>(this.pageUrl + '/' + id, {params})
      .pipe(catchError(error =>
        this.errorService.handleError(error)
      ));
  }

  public async postAsync(data: any): Promise<T | void> {
    return  this.httpClient.post<T>(this.pageUrl, data)
      .toPromise().catch((error) => {
        console.log(error);
        this.insertId = 0;
        this.errorService.handleError(error);

      });
  }


  public async putAsync(data: any): Promise<T | void> {

    if (data instanceof FormData) {

      return  this.httpClient.post<T>(this.pageUrl+ '/' + data.get('id'), data)
        .toPromise().catch((error) => {
          console.log(error);
          this.insertId = 0;
          this.errorService.handleError(error);

        });
    } else {
      return  this.httpClient.post<T>(this.pageUrl+'/'+ data.id, data)
        .toPromise().catch((error) => {
          console.log(error);
          this.insertId = 0;
          this.errorService.handleError(error);

        });
    }


  }


  public async getAsync(argument?: number | string | object): Promise<T | void> {

    const {params, queries} = await this.queryParamType(argument);

    return await this.httpClient.get<T>(this.pageUrl + queries, {
      params
    })
      .toPromise().catch((error) => {
        this.errorService.handleError(error);
      });
  }


  getDataObservable(): Observable<T> {
    return this.dataSubject.asObservable().pipe(filter(result => !!result));
  }

  getQueryArgumentObservable(): Observable<IQuery> {
    return this.queryArgument.asObservable().pipe(filter(result => !!result));
  }

  setQueryArgument(queries: IQuery): void {
    this.queryArgument.next(queries);
  }

  setShared(data: any) {
    this.shared.next(data);
  }

  clearAlert(): void {
    this.alertService.clear();
  }

  unsubscribe(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  queryParamType(argument?: number | string | object): { params: any, queries: string } {

    let params: any = {};
    let queries: string = '';
    if (typeof argument === 'number') {
      queries = '/' + argument.toString();
    } else if (typeof argument === 'string') {
      queries = '?' + argument;
    } else if (typeof argument === 'object') {
      params = argument;
    }

    return {params, queries};
  }
}
