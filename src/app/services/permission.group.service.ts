import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {IQuery} from '../interfaces/iquery';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {IPermissionGroup} from "../interfaces/ipermission.group";
import {PermissionGroup} from "../models/permission.group.model";
import {Observable} from "rxjs";
import {IResponseObject} from "../interfaces/iresponse.object";
import {ToastService} from "./toast.service";
import {PERMISSION_GROUP_SERVICE} from "../configs/path.constants";
import {delay} from "../utils/delay";


@Injectable({
  providedIn: 'root'
})
export class PermissionGroupService extends ApiService<IPermissionGroup> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override translate: TranslateService,
              private router: Router,
              private toastService: ToastService
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl = environment.baseUrl + PERMISSION_GROUP_SERVICE.base;
  }

  retrieve(argument?: number | string | object): Observable<IResponseObject<IPermissionGroup[]>> {
    return super.get(argument);
  }
  detail(id: number): Observable<IResponseObject<IPermissionGroup>> {
    return super.show(id);
  }
  save(permission: PermissionGroup): void {
    this.subscription.push(this.post(permission).subscribe(() => {
      this.alertService.success(this.messageCreate);
      delay(2000).then(() => this.router.navigate([PERMISSION_GROUP_SERVICE.list]));
    }));
  }

  update(permission: PermissionGroup, params?: IQuery): void {
    this.subscription.push(this.put(permission).subscribe(() => {
      this.alertService.success(this.messageUpdate);
      delay(2000).then(()=>this.router.navigate([PERMISSION_GROUP_SERVICE.list], {
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
