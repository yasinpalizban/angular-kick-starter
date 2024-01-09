import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAuth} from '../interfaces/iauthenticate';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {Auth} from '../models/authenticate.model';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {AuthenticateServiceInterface} from "../interfaces/authenticate.service.interface";
import {RoleType} from "../enums/role.enum";
import {AUTH_SERVICE} from "../configs/path.constants";
import {delay} from "../utils/delay";


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService extends ApiService<IAuth> implements AuthenticateServiceInterface {

  authChange: BehaviorSubject<IAuth> = new BehaviorSubject<IAuth>(JSON.parse(localStorage.getItem('user')!));
  private messageRegister!: string;
  private messageActivate!: string;
  private messageForgot!: string;
  private messageReset!: string;
  private messageSendSms!: string;
  private messageSendEmail!: string;

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override translate: TranslateService,
              private router: Router,
  ) {
    super(httpClient,
      alertService,
      translate);
    this.pageUrl = environment.baseUrl + AUTH_SERVICE.base;
    this.messageRegister = this.translate.instant(['auth.messageRegister']);
    this.messageRegister = this.translate.instant(['auth.messageRegister'])
    this.messageActivate = this.translate.instant(['auth.messageActivate']);
    this.messageForgot = this.translate.instant(['auth.messageForgot']);
    this.messageReset = this.translate.instant(['auth.messageReset']);
    this.messageSendSms = this.translate.instant(['auth.messageSendSms']);
    this.messageSendEmail = this.translate.instant(['auth.messageSendEmail']);
  }

  signIn(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/signin';
    this.subscription.push(this.post(auth).pipe(tap((value) => {
      this.authChange.next(value.data);
      localStorage.setItem('user', JSON.stringify(value.data));
    })).subscribe((value) => {
      const address: string = window.location.origin;
      let pathRedirect = '/admin/dashboard/over-view';
      if (value.data.role?.name == RoleType.Member) {
        pathRedirect = '/admin/profile';
      }
      if (address.search('www') !== -1) {
        window.location.replace(environment.siteAddress.two + pathRedirect);
      } else {
        window.location.replace(environment.siteAddress.one + pathRedirect);
      }
    }));
  }

  signOut(): void {
    this.pageUrl = environment.baseUrl + 'auth/signout';
    this.subscription.push(this.post({}).subscribe());
    this.authChange.next({});
    localStorage.removeItem('user');
    localStorage.removeItem('chatRoom');
    localStorage.removeItem('csrf');
    let address: string = window.location.origin;
    if (address.search('www') !== -1) {
      window.location.replace(environment.siteAddress.two + '/home/sign-in');
    } else {
      window.location.replace(environment.siteAddress.one + '/home/sign-in');
    }
  }

  isSignIn(): void {

    this.pageUrl = environment.baseUrl + 'auth/is-signin';
    const user: IAuth = JSON.parse(localStorage.getItem('user')!);
    if (user != null && !(user.jwt?.expire! < Math.floor(new Date().getTime() / 1000))) {
      const address: string = window.location.origin;
      let extendPath: string = '/admin/dashboard/over-view';
      if (user.role?.name == 'member') {
        extendPath = '/admin/profile';
      }
      if (address.search('www') !== -1) {
        window.location.replace(environment.siteAddress.two + extendPath);
      } else {
        window.location.replace(environment.siteAddress.one + extendPath);
      }
    }
  }

  activateAccountViaEmail(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/activate-account-email';
    this.subscription.push(this.post(auth).subscribe(data => {
      this.alertService.success(this.messageActivate);
      delay(2000).then(() => this.router.navigate(['/home/sign-in']));
    }));
  }

  sendActivateCodeViaEmail(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/send-activate-email';
    this.subscription.push(this.post(auth).subscribe(data => {
      this.alertService.success(this.messageSendEmail);
    }));
  }

  forgot(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/forgot';
    this.subscription.push(this.post(auth).subscribe(() => {
      this.alertService.success(this.messageForgot);
    }));
  }

  signUp(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/signup';
    this.subscription.push(this.post(auth).subscribe(() => {
      this.alertService.success(this.messageRegister);
      delay(2000).then(() => this.router.navigate(['/home/sign-in']));
    }));

  }

  resetPasswordViaEmail(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/reset-password-email';
    this.subscription.push(this.post(auth).subscribe(() => {
      this.alertService.success(this.messageReset);
      delay(2000).then(() => this.router.navigate(['/home/sign-in']));
    }));
  }

  resetPasswordViaSms(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/reset-password-sms';
    this.subscription.push(this.post(auth).subscribe(() => {
      this.alertService.success(this.messageReset);
      delay(2000).then(() => this.router.navigate(['/home/sign-in']));
    }));
  }

  public get authValue(): IAuth {
    return this.authChange.value;
  }

  activateAccountViaSms(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/activate-account-sms';
    this.subscription.push(this.post(auth).subscribe(() => {
      this.alertService.success(this.messageActivate);
      delay(2000).then(() => this.router.navigate(['/home/sign-in']));
    }));
  }

  sendActivateCodeViaSms(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/send-activate-sms';
    this.subscription.push(this.post(auth).subscribe(() => {
      this.alertService.success(this.messageSendSms);
    }));

  }
}
