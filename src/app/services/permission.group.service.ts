import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {ErrorService} from './error.service';

import {environment} from '../../environments/environment';


import {Router} from '@angular/router';
import {IQuery} from '../interfaces/query.interface';

import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {IPermissionGroup} from "../interfaces/permission.group.interface";
import {PermissionGroup} from "../models/permission.group.model";


@Injectable({
  providedIn: 'root'
})
export class PermissionGroupService extends  ApiService<IPermissionGroup> implements IApiCommonFunction{

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  errorService: ErrorService,
              protected override  translate: TranslateService,
              private router: Router
  ) {
    super(httpClient,
      alertService,
      errorService,
      environment.baseUrl + 'permissionGroup',
      translate);
  }


  query(argument?: number | string | object): void {

    this.subscription.push(super.get(argument).subscribe((setting) => {
      this.dataSubject.next(setting);
    }));
  }


  save(permission: PermissionGroup): void  {
    this.subscription.push(this.post(permission).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/permission-group/list']);
      }, 2000);
    }));
  }


  update(permission: PermissionGroup): void  {

    let params: IQuery;
    this.getQueryArgumentObservable().subscribe((qParam: IQuery) => {
      params = qParam;
    });

    this.subscription.push(this.put(permission).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageUpdate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/permission-group/list'], {
          queryParams: params
        });
      }, 2000);
    }));


  }


  remove(id: number): void  {

    this.subscription.push(this.delete(id).subscribe());


  }
}