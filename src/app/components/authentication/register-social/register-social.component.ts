import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {Auth} from '../../../models/authenticate.model';
import {MustMatch} from '../../../utils/must-match.validator';
import {AuthenticateService} from '../../../services/authenticate.service';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';
import {Subscription} from "rxjs";
import {ReCaptchaV3Service} from "ng-recaptcha";

@Component({
  selector: 'app-register',
  templateUrl: './register-social.component.html',
  styleUrls: ['./register-social.component.scss']
})
export class RegisterSocialComponent implements OnInit, OnDestroy {

  formGroup!: FormGroup;
  submitted: boolean;
  user!: SocialUser;
  subscription: Subscription[];

  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticateService,
              private socialAuthService: SocialAuthService,
              private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.submitted = false;
    this.subscription = [new Subscription()];
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

    this.subscription.push(this.socialAuthService.authState.subscribe((user:any) => {
      this.user = user;
      console.log(user);
      this.formGroup.controls['username'].setValue(user.name);
      this.formGroup.controls['login'].setValue(user.email);

    }));

  }

  onSubmit(): void {

    if (this.formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const auth = new Auth({
      username: this.user.name,
      login: this.user.email,
      password: this.formGroup.value.password,
      passConfirm: this.formGroup.value.passConfirm,
      socialLogin: "true",
      token: '',
      action: ''
    });
    this.authService.signUp(auth);
    this.formGroup.reset();
  }


  signOut(): void {
    this.socialAuthService.signOut();
  }

  ngOnDestroy(): void {
    this.socialAuthService.signOut();
    this.authService.unsubscribe();
    this.subscription.forEach(sub => sub.unsubscribe());
  }
}
