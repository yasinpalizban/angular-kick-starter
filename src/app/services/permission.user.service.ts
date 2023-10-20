import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {IQuery} from '../interfaces/query.interface';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {IPermissionUser} from "../interfaces/permission.user.interface";
import {PermissionUser} from "../models/permission.user.model";
import {Observable} from "rxjs";
import {ResponseObject} from "../interfaces/response.object.interface";
import {ToastService} from "./toast.service";


@Injectable({
  providedIn: 'root'
})
export class PermissionUserService extends  ApiService<IPermissionUser> implements IApiCommonFunction{

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  translate: TranslateService,
              private router: Router,
              private  toastService: ToastService
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl= environment.baseUrl + 'permissionUser';
  }


  query(argument?: number | string | object): Observable<ResponseObject<IPermissionUser>> {

    return  super.get(argument);
  }


  save(permission: PermissionUser): void  {
    this.subscription.push(this.post(permission).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/permission-user/list']);
      }, 2000);
    }));
  }


  update(permission: PermissionUser): void  {

    let params: IQuery;
    this.getQueryArgumentObservable().subscribe((qParam: IQuery) => {
      params = qParam;
    });

    this.subscription.push(this.put(permission).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageUpdate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/permission-user/list'], {
          queryParams: params
        });
      }, 2000);
    }));


  }


  remove(id: number): void  {

    this.subscription.push(this.delete(id).subscribe(() => {
      this.toastService.onToastDelete(this.messageDelete);
    }));


  }
}
