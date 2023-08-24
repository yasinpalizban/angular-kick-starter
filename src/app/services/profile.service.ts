import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AlertService} from './alert.service';

import {environment} from '../../environments/environment';
import {IProfile} from '../interfaces/profile.interface';
import {Profile} from '../models/profile.model';
import {ErrorService} from './error.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {IApiCommonFunction} from "../interfaces/api.common.function.service.interface";


@Injectable({
  providedIn: 'root'
})
export class ProfileService extends ApiService<IProfile> implements IApiCommonFunction {

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  errorService: ErrorService,
              protected override  translate: TranslateService,
  ) {
    super(httpClient,
      alertService,
      errorService,
      environment.baseUrl + 'profile',
      translate);

  }

  query(): void {
    this.subscription.push(super.get().subscribe((profile) => {
      this.dataSubject.next(profile);
    }));
  }


  save(profile: Profile | FormData): void {
    this.subscription.push(this.post(profile).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageCreate, this.alertService.alertOption);


    }));

  }


}
