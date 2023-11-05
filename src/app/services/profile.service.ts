import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {IProfile} from '../interfaces/iprofile.interface';
import {Profile} from '../models/profile.model';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";
import {Observable} from "rxjs";
import {IResponseObject} from "../interfaces/iresponse.object.interface";
import {PROFILE_SERVICE} from "../configs/path.constants";


@Injectable({
  providedIn: 'root'
})
export class ProfileService extends ApiService<IProfile> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override translate: TranslateService,
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl = environment.baseUrl + PROFILE_SERVICE.base;

  }

  query(): Observable<IResponseObject<IProfile>> {
    return super.get();
  }


  save(profile: Profile | FormData): void {
    this.subscription.push(this.post(profile).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);


    }));

  }


}
