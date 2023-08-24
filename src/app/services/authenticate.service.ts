import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {IAuth} from '../interfaces/authenticate.interface';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AlertService} from './alert.service';
import {environment} from '../../environments/environment';
import {Auth} from '../models/authenticate.model';
import {ErrorService} from './error.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from './api.service';
import {AuthenticateServiceInterface} from "../interfaces/authenticate.service.interface";
import {RoleType} from "../enums/role.enum";


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService extends ApiService<IAuth> implements AuthenticateServiceInterface {

  authChange: BehaviorSubject<IAuth>;


  private messageRegister!: string;
  private messageActivate!: string;
  private messageForgot!: string;
  private messageReset!: string;
  private messageSendSms!: string;
  private messageSendEmail!: string;

  constructor(protected override httpClient: HttpClient,
              protected override alertService: AlertService,
              protected override  errorService: ErrorService,
              protected override  translate: TranslateService,
              private router: Router,
  ) {
    super(httpClient,
      alertService,
      errorService,
      environment.baseUrl + 'auth',
      translate);

    this.subscription = [];
    this.translate.get(['auth.messageRegister']).subscribe(data => this.messageRegister = data['auth.messageRegister']);
    this.translate.get(['auth.messageActivate']).subscribe(data => this.messageActivate = data['auth.messageActivate']);
    this.translate.get(['auth.messageForgot']).subscribe(data => this.messageForgot = data['auth.messageForgot']);
    this.translate.get(['auth.messageReset']).subscribe(data => this.messageReset = data['auth.messageReset']);
    this.translate.get(['auth.messageSendSms']).subscribe(data => this.messageSendSms = data['auth.messageSendSms']);
    this.translate.get(['auth.messageSendEmail']).subscribe(data => this.messageSendEmail = data['auth.messageSendEmail']);
    this.authChange = new BehaviorSubject<IAuth>(JSON.parse(localStorage.getItem('user')!));

  }

  signIn(auth: Auth): void {

    this.pageUrl = environment.baseUrl + 'auth/signin';
    this.subscription.push(this.post(auth).pipe(tap((auth: IAuth) => {
      this.authChange.next(auth);
      localStorage.setItem('csrf', auth.csrf!);
      localStorage.setItem('user', JSON.stringify(auth));
    })).subscribe((data: IAuth) => {
      let address: string = window.location.origin;
      let pathRedirect = '/admin/dashboard/over-view';
      if (data.role?.name == RoleType.Member) {
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
   // this.router.navigate(['./../../home/sign-in']);
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

    if (user != null && !(user.jwt?.expire! < Math.floor(new Date().getTime() / 1000)))
      this.subscription.push(this.get().subscribe((data: IAuth) => {

        if (data.success == true) {
          let address: string = window.location.origin;
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

      }));

  }

  activateAccountViaEmail(auth: Auth): void {


    this.pageUrl = environment.baseUrl + 'auth/activate-account-email';
    this.subscription.push(this.post(auth).subscribe(data => {
      this.alertService.clear();
      this.alertService.success(this.messageActivate, this.alertOptions);
      setTimeout(() => {
        this.router.navigate(['/home/sign-in']);
      }, 2000);
    }));

  }

  sendActivateCodeViaEmail(auth: Auth): void {

    this.pageUrl = environment.baseUrl + 'auth/send-activate-email';
    this.subscription.push(this.post(auth).subscribe(data => {
      // console.log(data);
      this.alertService.clear();
      this.alertService.success(this.messageSendEmail, this.alertOptions);
    }));
  }

  forgot(auth: Auth): void {


    this.pageUrl = environment.baseUrl + 'auth/forgot';
    this.subscription.push(this.post(auth).subscribe(() => {
      this.alertService.clear();
      this.alertService.success(this.messageForgot, this.alertOptions);
    }));
  }

  signUp(auth: Auth): void {

    this.pageUrl = environment.baseUrl + 'auth/signup';
    this.subscription.push(this.post(auth).subscribe(() => {
      // console.log(data);
      this.alertService.clear();
      this.alertService.success(this.messageRegister, this.alertOptions);
      setTimeout(() => {
        this.router.navigate(['/home/sign-in']);
      }, 2000);
    }));

  }

  resetPasswordViaEmail(auth: Auth): void {

    this.pageUrl = environment.baseUrl + 'auth/reset-password-email';
    this.subscription.push(this.post(auth).subscribe(() => {
      // console.log(data);
      this.alertService.clear();
      this.alertService.success(this.messageReset, this.alertOptions);
      setTimeout(() => {
        this.router.navigate(['/home/sign-in']);
      }, 2000);
    }));
  }

  resetPasswordViaSms(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/reset-password-sms';
    this.subscription.push(this.post(auth).subscribe(() => {
      // console.log(data);
      this.alertService.clear();
      this.alertService.success(this.messageReset, this.alertOptions);
      setTimeout(() => {
        this.router.navigate(['/home/sign-in']);
      }, 2000);
    }));
  }

  public get authValue(): IAuth {
    return this.authChange.value;
  }


  activateAccountViaSms(auth: Auth): void {
    this.pageUrl = environment.baseUrl + 'auth/activate-account-sms';
    this.subscription.push(this.post(auth).subscribe(() => {
      // console.log(data);
      this.alertService.clear();
      this.alertService.success(this.messageActivate, this.alertOptions);
      setTimeout(() => {
        this.router.navigate(['/home/sign-in']);
      }, 2000);
    }));

  }


  sendActivateCodeViaSms(auth: Auth): void {


    this.pageUrl = environment.baseUrl + 'auth/send-activate-sms';
    this.subscription.push(this.post(auth).subscribe(() => {
      // console.log(data);
      this.alertService.clear();
      this.alertService.success(this.messageSendSms, this.alertOptions);
    }));

  }



}
