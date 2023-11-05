import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {ISetting} from '../interfaces/isetting.interface';
import {Setting} from '../models/setting.model';
import {Router} from '@angular/router';
import {IQuery} from '../interfaces/iquery.interface';
import {ApiService} from './api.service';
import {TranslateService} from '@ngx-translate/core';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {Observable} from "rxjs";
import {IResponseObject} from "../interfaces/iresponse.object.interface";
import {ToastService} from "./toast.service";
import {SETTING_SERVICE} from "../configs/path.constants";
import {delay} from "../utils/delay";

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
    this.pageUrl = environment.baseUrl + SETTING_SERVICE.base;
  }


  query(argument?: number | string | object | null): Observable<IResponseObject<ISetting>> {
    return super.get(argument);
  }


  save(setting: Setting): void {

    this.subscription.push(this.post(setting).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);
      delay(2000).then(()=>this.router.navigate([SETTING_SERVICE.list]));
    }));
  }


  update(setting: Setting,params?: IQuery): void {

    this.subscription.push(this.put(setting).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageUpdate, this.alertService.alertOption);
        delay(2000).then(()=>this.router.navigate([SETTING_SERVICE.list],{
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
