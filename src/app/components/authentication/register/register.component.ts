import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {Auth} from '../../../models/authenticate.model';
import {MustMatch} from '../../../utils/must-match.validator';
import {AuthenticateService} from '../../../services/authenticate.service';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';
import { takeUntil} from "rxjs";
import {ReCaptchaV3Service} from "ng-recaptcha";
import {faFacebookF, faInstagram, faGoogle} from '@fortawesome/free-brands-svg-icons'
import {BasicForm} from "../../../abstracts/basic.form";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BasicForm implements OnInit, OnDestroy {
  icons = {faFacebookF, faGoogle, faInstagram};
  token: string;
  action: string;
  socialUser!: SocialUser;
  isLoggedin!: boolean;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticateService,
              private socialAuthService: SocialAuthService,
              private recaptchaV3Service: ReCaptchaV3Service,
              protected  override  router:Router
  ) {
    super(router);
    this.token = ''
    this.action = 'importantAction';

  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      login: new FormControl('', [
        Validators.required,
      ]),
      username: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
      passConfirm: new FormControl('', [
        Validators.required,

      ]),
    }, {
      validators: MustMatch('password', 'passConfirm')
    });


    this.recaptchaV3Service.execute(this.action).pipe(takeUntil(this.subscription$))
      .subscribe((token) => {
        this.token = token;
      });


    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);

    });
  }

  onSubmit(): void {

    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const auth = new Auth({
      username: this.formGroup.value.username,
      login: this.formGroup.value.login,
      password: this.formGroup.value.password,
      passConfirm: this.formGroup.value.passConfirm,
      socialLogin: "false",
      action: this.action,
      token: this.token
    });
    this.authService.signUp(auth);
    this.formGroup.reset();
  }

  signInWithGoogle(): void {
 //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, {scope: 'profile email'}).then(data => data);

  }

  signInWithInstagram(): void {
    // this.socialAuthService.signIn().then();
  //  this.socialAuthService.signOut().then();
  }

  signInWithFB(): void {
    //  this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID,{
    //   scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
    //   return_scopes: true,
    //   enable_profile_selector: true
    // };).then();
  }


  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  override ngOnDestroy(): void {
    this.authService.unsubscribe();
  }
}
