import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {IQuery} from '../interfaces/query.interface';
import {IUser} from '../interfaces/user.interface';
import {User} from '../models/user.model';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {Observable} from "rxjs";
import {ResponseObject} from "../interfaces/response.object.interface";
import {ToastService} from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService<IUser> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  translate: TranslateService,
              private router: Router,
              private  toastService : ToastService
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl=environment.baseUrl + 'user';
  }
  query(argument?: number | string | object): Observable<ResponseObject<IUser>>{
    return super.get(argument);
  }


  save(user: User): void {
    this.subscription.push(this.post(user).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/user/list']);
      }, 2000);
    }));
  }
  update(user: User): void {

    let params: IQuery;
    this.getQueryArgumentObservable().subscribe((qParam: IQuery) => {
      params = qParam;
    });
    this.subscription.push(this.put(user).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageUpdate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/user/list'], {
          queryParams: params
        });
      }, 2000);
    }));

  }
  remove(id: number): void {


    this.subscription.push(this.delete(id).subscribe(() => {
      this.toastService.onToastDelete(this.messageDelete);
    }));
  }
}
