import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "./alert.service";
import {ErrorService} from "./error.service";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../environments/environment";
import {IOverView} from "../interfaces/over.view.interface";

@Injectable({
  providedIn: 'root'
})
export class OverViewService extends ApiService<IOverView> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  errorService: ErrorService,
              protected override  translate: TranslateService,
  ) {
    super(httpClient,
      alertService,
      errorService,
      environment.baseUrl + 'overView',
      translate);
  }


  query(argument?: number | string | object): void {

    this.subscription.push(super.get(argument).subscribe((setting) => {
      this.dataSubject.next(setting);
    }));
  }

}
