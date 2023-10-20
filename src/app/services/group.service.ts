import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {IGroup} from '../interfaces/group.interface';
import {Router} from '@angular/router';
import {IQuery} from '../interfaces/query.interface';
import {Group} from '../models/group.model';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {Observable} from "rxjs";
import {ResponseObject} from "../interfaces/response.object.interface";
import {ToastService} from "./toast.service";

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
    this.pageUrl = environment.baseUrl + 'group';
  }


  query(argument?: number | string | object): Observable<ResponseObject<IGroup>> {

    return super.get(argument);
  }


  save(group: Group): void {
    this.subscription.push(this.post(group).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/group/list']);
      }, 2000);
    }));
  }


  update(group: Group): void {

    let params: IQuery;
    this.getQueryArgumentObservable().subscribe((qParam: IQuery) => {
      params = qParam;
    });

    this.subscription.push(this.put(group).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageUpdate, this.alertService.alertOption);
      setTimeout(() => {
        this.router.navigate(['./admin/group/list'], {
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
