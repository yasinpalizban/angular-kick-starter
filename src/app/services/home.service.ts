import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from "./api.service";
import {homeServiceInterface} from "../interfaces/home.service.interface";
import {HOME_SERVICE} from "../configs/path.constants";
import {Observable} from "rxjs";
import {IResponseObject} from "../interfaces/iresponse.object";
import {IHomeSetting} from "../interfaces/ihome";


@Injectable({
  providedIn: 'root'
})
export class HomeService extends ApiService<any> implements homeServiceInterface {
  private contactSent!: string;

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override translate: TranslateService,
              private cookieService: CookieService,
  ) {
    super(httpClient,
      alertService,
      translate);

    this.pageUrl = environment.baseUrl + HOME_SERVICE.base;
    this.contactSent = this.translate.instant(['website.other.contactSent']);
  }

  settingList(): Observable<IResponseObject<IHomeSetting[]>> {
    this.pageUrl = environment.baseUrl + 'home/setting-list';
    return super.get(null);
  }
}
