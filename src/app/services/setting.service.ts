import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {ISetting} from '../interfaces/setting.interface';
import {Setting} from '../models/setting.model';
import {Router} from '@angular/router';
import {IQuery} from '../interfaces/query.interface';
import {ApiService} from './api.service';
import {TranslateService} from '@ngx-translate/core';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {Observable} from "rxjs";
import {ResponseObject} from "../interfaces/response.object.interface";
import {ToastService} from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class SettingService extends ApiService<ISetting> implements IApiCommonFunction {
  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override translate: TranslateService,
              private router: Router,
              private toastService: ToastService
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl = environment.baseUrl + 'setting';
  }


  query(argument?: number | string | object | null): Observable<ResponseObject<ISetting>> {
    return super.get(argument);
  }


  save(setting: Setting): void {

    this.subscription.push(this.post(setting).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/setting/list']);
      }, 2000);
    }));
  }


  update(setting: Setting): void {

    let params: IQuery;
    this.getQueryArgumentObservable().subscribe((qParam: IQuery) => {
      params = qParam;
    });
    this.subscription.push(this.put(setting).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageUpdate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/setting/list'], {
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
