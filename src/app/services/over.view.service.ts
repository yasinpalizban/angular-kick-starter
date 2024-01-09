import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "./alert.service";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../environments/environment";
import {IOverView} from "../interfaces/iover.view";
import {Observable} from "rxjs";
import {IResponseObject} from "../interfaces/iresponse.object";
import {OVERVIEW_SERVICE} from "../configs/path.constants";
@Injectable({
  providedIn: 'root'
})
export class OverViewService extends ApiService<IOverView> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  translate: TranslateService,
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl= environment.baseUrl + OVERVIEW_SERVICE.base;
  }

  retrieve(argument?: number | string | object): Observable<IResponseObject<IOverView>> {
    return super.show();
  }
}
