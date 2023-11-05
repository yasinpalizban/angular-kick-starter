import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {IGroup} from '../interfaces/igroup.interface';
import {Router} from '@angular/router';
import {IQuery} from '../interfaces/iquery.interface';
import {Group} from '../models/group.model';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {Observable} from "rxjs";
import {IResponseObject} from "../interfaces/iresponse.object.interface";
import {ToastService} from "./toast.service";
import {GROUP_SERVICE} from "../configs/path.constants";
import {delay} from "../utils/delay";

@Injectable({
  providedIn: 'root'
})
export class GroupService extends ApiService<IGroup> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override translate: TranslateService,
              private router: Router,
              private toastService: ToastService
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl = environment.baseUrl + GROUP_SERVICE.base;
  }

  query(argument?: number | string | object): Observable<IResponseObject<IGroup>> {
    return super.get(argument);
  }

  save(group: Group): void {
    this.subscription.push(this.post(group).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);
      delay(2000).then(() => this.router.navigate([GROUP_SERVICE.list]));
    }));
  }

  update(group: Group, params?: IQuery): void {
    this.subscription.push(this.put(group).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageUpdate, this.alertService.alertOption);
      delay(2000).then(() => this.router.navigate([GROUP_SERVICE.list], {
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
