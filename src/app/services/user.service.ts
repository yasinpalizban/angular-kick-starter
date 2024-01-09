import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {IQuery} from '../interfaces/iquery';
import {IUser} from '../interfaces/iuser';
import {User} from '../models/user.model';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {Observable} from "rxjs";
import {IResponseObject} from "../interfaces/iresponse.object";
import {ToastService} from "./toast.service";
import {USER_SERVICE} from "../configs/path.constants";
import {delay} from "../utils/delay";

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService<IUser> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override translate: TranslateService,
              private router: Router,
              private toastService: ToastService
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl = environment.baseUrl + USER_SERVICE.base;
  }

  retrieve(argument?: number | string | object): Observable<IResponseObject<IUser[]>> {
    return super.get(argument);
  }

  detail(id: number): Observable<IResponseObject<IUser>> {
    return super.show(id);
  }

  save(user: User): void {
    this.subscription.push(this.post(user).subscribe(() => {
      this.alertService.success(this.messageCreate);
      delay(2000).then(() => this.router.navigate([USER_SERVICE.list]));
    }));
  }

  update(user: User, params?: IQuery): void {
    this.subscription.push(this.put(user).subscribe(() => {
      this.alertService.success(this.messageUpdate);
      delay(2000).then(() => this.router.navigate([USER_SERVICE.list], {
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
