import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MustMatch} from '../../../../utils/must-match.validator';
import {Auth} from '../../../../models/authenticate.model';
import {AuthenticateService} from '../../../../services/authenticate.service';
import {BasicForm} from "../../../../abstracts/basic.form";
import {Router} from "@angular/router";


@Component({
  selector: 'app-reset-password-via-sms',
  templateUrl: './reset.password.via.sms.component.html',
  styleUrls: ['./reset.password.via.sms.component.scss']
})
export class ResetPasswordViaSmsComponent extends  BasicForm implements OnInit, OnDestroy {


  constructor(private formBuilder: FormBuilder,
              private authService: AuthenticateService,
              protected  override router: Router
              ) {
   super(router);
  }

  ngOnInit(): void {

    this. formGroup = this.formBuilder.group({
      code: new FormControl('', [
        Validators.required
      ]),
      phone: new FormControl('', [
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
  }

  onSubmit(): void {
    if (this. formGroup.invalid) {
      return;
    }
    this.submitted = true;
    const auth = new Auth({
      resetToken: this. formGroup.value.code,
      phone: this. formGroup.value.phone,
      password: this. formGroup.value.password,
      passConfirm: this. formGroup.value.passConfirm
    });
    this.authService.resetPasswordViaSms(auth);
  }


  override ngOnDestroy(): void {
    this.authService.unsubscribe();
  }
}
