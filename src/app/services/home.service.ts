import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {ErrorService} from './error.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from "./api.service";
import {IHome} from "../interfaces/home.interface";
import {homeServiceInterface} from "../interfaces/home.service.interface";

import * as $ from 'jquery';
declare const mySliders: any;


@Injectable({
  providedIn: 'root'
})
export class HomeService extends ApiService<IHome> implements homeServiceInterface {
  private contactSent!: string;

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  errorService: ErrorService,
              protected override  translate: TranslateService,
              private  cookieService: CookieService,
  ) {
    super(httpClient,
      alertService,
      errorService,
      environment.baseUrl + 'home',
      translate);



    this.translate.get(['website.other.contactSent']).subscribe(data => this.contactSent = data['website.other.contactSent']);
  }


  settingList(): void {

    this.pageUrl = environment.baseUrl + 'home/setting-list';
    this.subscription.push(super.get().subscribe((home) => {
      if (home.settingPost)
        this.dataSubject.next({settingPost: home.settingPost});
    }));

  }






}
