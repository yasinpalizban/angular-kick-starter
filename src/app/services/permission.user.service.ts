import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {IQuery} from '../interfaces/iquery.interface';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {IPermissionUser} from "../interfaces/ipermission.user.interface";
import {PermissionUser} from "../models/permission.user.model";
import {Observable} from "rxjs";
import {IResponseObject} from "../interfaces/iresponse.object.interface";
import {ToastService} from "./toast.service";
import { PERMISSION_USER_SERVICE} from "../configs/path.constants";
import {delay} from "../utils/delay";


@Injectable({
  providedIn: 'root'
})
export class PermissionUserService extends ApiService<IPermissionUser> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override translate: TranslateService,
              private router: Router,
              private toastService: ToastService
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl = environment.baseUrl + PERMISSION_USER_SERVICE.base;
  }


  query(argument?: number | string | object): Observable<IResponseObject<IPermissionUser>> {
    return super.get(argument);
  }


  save(permission: PermissionUser): void {
    this.subscription.push(this.post(permission).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);
      delay(2000).then(() => this.router.navigate([PERMISSION_USER_SERVICE.list]));
    }));
  }


  update(permission: PermissionUser, params?: IQuery): void {
    this.subscription.push(this.put(permission).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageUpdate, this.alertService.alertOption);
      delay(2000).then(() => this.router.navigate([PERMISSION_USER_SERVICE.list], {
        queryParams: params
      }));
    }));
  }


  remove(id: number): void {
    this.subscription.push(this.delete(id).subscribe(() => {
      this.toastService.onToastDelete(this.messageDelete);
    }));
  }
}
